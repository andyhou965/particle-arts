const myImage = new Image();
myImage.src = "assets/iron-man01.jpeg";

myImage.addEventListener("load", () => {
	const canvas = document.getElementById("canvas1");
	const ctx = canvas.getContext("2d");
	canvas.width = 656;
	canvas.height = 743;

	ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
	const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	let particlesArray = [];
	const numberOfParticles = 10000;

	let mappedImage = [];
	for (let y = 0; y < canvas.height; y++) {
		let row = [];
		for (let x = 0; x < canvas.width; x++) {
			const red = pixels.data[y * 4 * pixels.width + x * 4];
			const green = pixels.data[y * 4 * pixels.width + (x * 4 + 1)];
			const blue = pixels.data[y * 4 * pixels.width + (x * 4 + 2)];
			const brightness = calculateRelativeBrightness(red, green, blue);
			const cell = [
				(cellBrightness = brightness),
				(cellColor = "rgb(" + red + "," + green + "," + blue + ")"),
			];
			row.push(cell);
		}
		mappedImage.push(row);
	}

	function calculateRelativeBrightness(red, green, blue) {
		return (
			Math.sqrt(
				red * red * 0.299 + green * green * 0.587 + blue * blue * 0.114
			) / 100
		);
	}

	class Particle {
		constructor() {
			this.x = Math.random() * canvas.width;
			this.y = 0;
			this.speed = 0;
			this.velocity = Math.random() * 0.5;
			this.size = Math.random() * 1.5 + 0.5;
			this.position1 = Math.floor(this.y);
			this.position2 = Math.floor(this.x);
		}
		update() {
			this.position1 = Math.floor(this.y);
			this.position2 = Math.floor(this.x);
			this.speed = mappedImage[this.position1][this.position2][0];
			let movement = 2.5 - this.speed + this.velocity;

			this.y += movement;
			if (this.y >= canvas.height) {
				this.y = 0;
				this.x = Math.random() * canvas.width;
			}
		}
		draw() {
			ctx.beginPath();
			// Colorfull
			// ctx.fillStyle = mappedImage[this.position1][this.position2][1];
			// White
			ctx.fillStyle = "white";
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}
	function init() {
		for (let i = 0; i < numberOfParticles; i++) {
			particlesArray.push(new Particle());
		}
	}
	init();
	function animate() {
		// ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 0.03;
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.globalAlpha = 0.2;
		for (let i = 0; i < particlesArray.length; i++) {
			particlesArray[i].update();
			ctx.globalAlpha = particlesArray[i].speed * 0.5;
			particlesArray[i].draw();
		}
		requestAnimationFrame(animate);
	}
	animate();
});
