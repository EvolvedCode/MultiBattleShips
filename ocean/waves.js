var main = function () {
    var simulatorCanvas = document.getElementById(SIMULATOR_CANVAS_ID),
        uiDiv = document.getElementById(UI_DIV_ID),
        cameraDiv = document.getElementById(CAMERA_DIV_ID);

    var camera = new Camera(),
        projectionMatrix = makePerspectiveMatrix(new Float32Array(16), FOV, 1, NEAR, FAR);
    
    var simulator = new Simulator(simulatorCanvas, window.innerWidth, window.innerHeight);

    var width = window.innerWidth,
        height = window.innerHeight;

    var lastMouseX = 0;
    var lastMouseY = 0;
    var mode = NONE;

    var setUIPerspective = function (height) {
        var fovValue = 0.5 / Math.tan(FOV / 2) * height;
        setPerspective(uiDiv, fovValue + 'px');
    };

    var inverseProjectionViewMatrix = [],
        nearPoint = [],
        farPoint = [];
    var unproject = function (viewMatrix, x, y, width, height) {
        premultiplyMatrix(inverseProjectionViewMatrix, viewMatrix, projectionMatrix);
        invertMatrix(inverseProjectionViewMatrix, inverseProjectionViewMatrix);

        setVector4(nearPoint, (x / width) * 2.0 - 1.0, ((height - y) / height) * 2.0 - 1.0, 1.0, 1.0);
        transformVectorByMatrix(nearPoint, nearPoint, inverseProjectionViewMatrix);

        setVector4(farPoint, (x / width) * 2.0 - 1.0, ((height - y) / height) * 2.0 - 1.0, -1.0, 1.0);
        transformVectorByMatrix(farPoint, farPoint, inverseProjectionViewMatrix);

        projectVector4(nearPoint, nearPoint);
        projectVector4(farPoint, farPoint);

        var t = -nearPoint[1] / (farPoint[1] - nearPoint[1]);
        var point = [
            nearPoint[0] + t * (farPoint[0] - nearPoint[0]),
            nearPoint[1] + t * (farPoint[1] - nearPoint[1]),
            nearPoint[2] + t * (farPoint[2] - nearPoint[2]),
        ];

        return point;
    };

    var onresize = function () {
        var SCR_HEIGHT = window.innerWidth,
        SCR_HEIGHT = window.innerHeight;

		makePerspectiveMatrix(projectionMatrix, FOV, SCR_HEIGHT / SCR_HEIGHT, NEAR, FAR);
		simulator.resize(SCR_HEIGHT, SCR_HEIGHT);
		uiDiv.style.width = SCR_HEIGHT + 'px';
		uiDiv.style.height = SCR_HEIGHT + 'px';
		cameraDiv.style.width = SCR_HEIGHT + 'px';
		cameraDiv.style.height = SCR_HEIGHT + 'px';
		simulatorCanvas.style.top = '0px';
		uiDiv.style.top = '0px';
		setUIPerspective(SCR_HEIGHT);
		width = SCR_HEIGHT;
		height = SCR_HEIGHT;
    };

    window.addEventListener('resize', onresize);
    onresize();

    var lastTime = (new Date()).getTime();
    var render = function render (currentTime) {
        var deltaTime = (currentTime - lastTime) / 1000 || 0.0;
        lastTime = currentTime;

        var fovValue = 0.5 / Math.tan(FOV / 2) * height;
        setTransform(cameraDiv, 'translate3d(0px, 0px, ' + fovValue + 'px) ' + toCSSMatrix(camera.getViewMatrix()) + ' translate3d(' + width / 2 + 'px, ' + height / 2 + 'px, 0px)');
        simulator.render(deltaTime, projectionMatrix, camera.getViewMatrix(), camera.getPosition());

        requestAnimationFrame(render);
    };
    render();
};

if (hasWebGLSupportWithExtensions(['OES_texture_float', 'OES_texture_float_linear'])) {
    main();
} else {
    document.getElementById('error').style.display = 'block';
    document.getElementById('footer').style.display = 'none';
}