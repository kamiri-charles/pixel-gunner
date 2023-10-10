window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const start_btn = document.getElementById('start');
    const game_over_modal = document.getElementById('game-over');
    const score_el = document.getElementById('score-el');
    const modal_score = document.getElementById('modal-score');
    
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    
    class Player {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
    };
    
    class Projectile {
        constructor(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
        
        update() {
            this.draw();
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;
        }
    }
    
    
    class Enemy {
        constructor(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
        
        update() {
            this.draw();
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;
        }
    }
    
    
    const friction = 0.99;
    class Particle {
        constructor(x, y, radius, color, velocity) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = velocity;
            this.alpha = 1;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }
        
        update() {
            this.draw();
            this.velocity.x *= friction;
            this.velocity.y *= friction;
            this.x = this.x + this.velocity.x;
            this.y = this.y + this.velocity.y;
            this.alpha -= 0.01;
        }
    }
    
    
    let player = new Player(canvas.width * 0.5, canvas.height * 0.5, 15, 'white');
    
    let projectiles = [];
    let enemies = [];
    let particles = [];
    
    const init = () => {
        player = new Player(canvas.width * 0.5, canvas.height * 0.5, 15, "white");
        projectiles = [];
        enemies = [];
        particles = [];
        score = 0;
        score_el.innerText = score;
        modal_score.innerText = score;
    };
    
    addEventListener('click', e => {
        const angle = Math.atan2(e.clientY - canvas.height / 2, e.clientX - canvas.width / 2);
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        };
        projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 3, 'white', velocity));
    });
    
    const spawn_enemies = () => {
        setInterval(() => {
            const radius = Math.floor(Math.random() + (30 - 10) + 10);
            let x;
            let y;
            
            if (Math.random() < 0.5) {
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                y = Math.random() * canvas.hieght;
            } else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            }
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
            const angle = Math.atan2(
                canvas.height / 2 - y,
                canvas.width / 2 - x
                );
                const velocity = {
                    x: Math.cos(angle),
                    y: Math.sin(angle),
                };
                enemies.push(new Enemy(x, y, radius, color, velocity));
            }, 1000)
        }
        
        let score = 0;
        let animation_id;
        const animate = () => {
            animation_id = requestAnimationFrame(animate);
            // Clear canvas after every frame
            ctx.beginPath();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.closePath();
            
            player.draw();
            
            // Particle effect
            particles.forEach((particle, idx) => {
                if (particle.alpha <= 0) {
                    setTimeout(() => particles.splice(idx, 1) ,0);
                } else {
                    particle.update();
                };
            });
            
            // Projectiles
            projectiles.forEach((p, idx) => {
                p.update();
                
                if (p.x + p.radius < 0 ||
                    p.x - p.radius > canvas.width ||
                    p.y + p.radius < 0 ||
                    p.y - p.radius > canvas.height) {
                        setTimeout(() => {projectiles.splice(idx, 1)}, 0);
                    }
                });
                
                // Enemies
                enemies.forEach((e, e_idx) => {
                    e.update();
                    
                    // Collision with player
                    let player_dist = Math.hypot(player.x - e.x, player.y - e.y);
                    
                    // Game over
                    if (player_dist - e.radius - player.radius < 1) {
                        cancelAnimationFrame(animation_id);
                        modal_score.innerText = score;
                        game_over_modal.style.display = 'flex';
                    };
                    
                    // Collision with projectiles
                    projectiles.forEach((p, p_idx) => {
                        let dist = Math.hypot(p.x - e.x, p.y - e.y);
                        
                        if (dist - e.radius - p.radius < 1) {
                            
                            for (let i = 0; i < e.radius * 2; i++) {
                                particles.push(new Particle(p.x, p.y, Math.random() * 2, e.color, {x: (Math.random() - 0.5) * (Math.random() * 8), y: (Math.random() - 0.5) * (Math.random() * 8)}));
                            };
                            
                            if (e.radius - 10 > 5) {
                                gsap.to(e, {radius: e.radius - 10});
                                setTimeout(() => projectiles.splice(p_idx, 1), 0);
                                score += 100;
                                score_el.innerText = score;
                            } else {
                                setTimeout(() => {
                                    enemies.splice(e_idx, 1);
                                    projectiles.splice(p_idx, 1);
                                }, 0);
                                score += 250;
                                score_el.innerText = score;
                            }
                        }
                    });
                });
            };
            
            // Start game
            start_btn.addEventListener("click", () => {
                init();
                animate();
                spawn_enemies();
                
                game_over_modal.style.display = 'none';
            });
        });