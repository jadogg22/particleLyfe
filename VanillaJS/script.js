class Particle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = (Math.random() - 0.5) * 2;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    update(canvasWidth, canvasHeight, particles, colorInteractions) {
        // Check boundaries
        if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Interaction with other particles
        particles.forEach(particle => {
            if (particle !== this) {
                const dx = particle.x - this.x;
                const dy = particle.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const unitVectorX = dx / distance;
                const unitVectorY = dy / distance;

                const rmin = 0.3;
                const a = colorInteractions[this.color][particle.color];
                let force = distance < rmin ? (distance / rmin - 1) : a * (1 - Math.abs(1 + rmin - 2 * distance) / (1 - rmin));
                force /= distance;
                force *= 0.25;


                this.dx += unitVectorX * force;
                this.dy += unitVectorY * force;
            }
        });

        // Move particle
        this.x += this.dx;
        this.y += this.dy;
    }
}

const canvas = document.getElementById('simulation');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const numParticles = 100;
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF'];
const colorInteractions = {
    '#FF5733': {'#FF5733': 1, '#33FF57': 0.5, '#3357FF': -0.5, '#F333FF': -1},
    '#33FF57': {'#FF5733': 0.5, '#33FF57': 1, '#3357FF': -0.5, '#F333FF': -1},
    '#3357FF': {'#FF5733': -0.5, '#33FF57': -0.5, '#3357FF': 1, '#F333FF': 0.5},
    '#F333FF': {'#FF5733': -1, '#33FF57': -1, '#3357FF': 0.5, '#F333FF': 1}
};

for (let i = 0; i < numParticles; i++) {
    const radius = Math.random() * 5 + 2;
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(new Particle(x, y, radius, color));
}

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update(canvas.width, canvas.height, particles, colorInteractions);
        particle.draw(context);
    });
}

animate();
