let bubbles = [];
let bubbleCreationRate = 0.015; // Initial chance of creating a new bubble each frame
let clusterPoints = []; // Initialize as an empty array

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 1);

  // Define cluster points after canvas is created
  clusterPoints = [
    { x: width / 4, y: height / 4 },
    { x: (3 * width) / 4, y: height / 4 },
    { x: width / 2, y: (3 * height) / 4 }
  ];

  // Start with a few initial bubbles
  for (let i = 0; i < 5; i++) {
    createBubble();
  }
}

function draw() {
  background(0,0,0); // Black background
  
  // Randomly create new bubbles based on the creation rate
  if (random(1) < bubbleCreationRate) {
    createBubble();
  }

  // Update and display all bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].update();
    bubbles[i].display();

    // Remove bubbles that have burst
    if (bubbles[i].hasBurst) {
      bubbles.splice(i, 1);
    }
  }

  // Gradually increase the bubble creation rate over time
  bubbleCreationRate = min(bubbleCreationRate + 0.0001, 0.2); // Cap the rate at 0.2

  //
}

function createBubble() {
  let x = random(width); // Random x position across the canvas
  let y = random(height); // Random y position across the canvas
  let size = random(10, 40); // Random size
  let speed = random(1, 3); // Random speed
  let wobble = random(0.5, 2); // Random wobble
  let hue = random(100); // 
  let opacity = 1; // Start fully opaque
  bubbles.push(new Bubble(x, y, size, speed, wobble, hue, opacity));
}

class Bubble {
  constructor(x, y, size, speed, wobble, hue, opacity) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.wobble = wobble;
    this.hue = hue;
    this.opacity = opacity; // Initial opacity
    this.hasBurst = false;
  }

  update() {
    if (this.hasBurst) return;

    // Gradually decrease opacity
    this.opacity -= 0.002; // Adjust fade speed here
    if (this.opacity <= 0) {
      this.opacity = 0;
      this.hasBurst = true; // Mark as burst when fully faded
      return;
    }

    // Find the nearest cluster point
    let nearestCluster = clusterPoints[0];
    let minDistance = dist(this.x, this.y, clusterPoints[0].x, clusterPoints[0].y);

    for (let cluster of clusterPoints) {
      let distance = dist(this.x, this.y, cluster.x, cluster.y);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCluster = cluster;
      }
    }

    // Move the bubble toward the nearest cluster point
    const attractionStrength = 0.02; // Adjust this value to control clustering speed
    this.x += (nearestCluster.x - this.x) * attractionStrength;
    this.y += (nearestCluster.y - this.y) * attractionStrength;

    // Prevent bubbles from fully touching each other
    for (let other of bubbles) {
      if (other === this || other.hasBurst) continue;

      let distance = dist(this.x, this.y, other.x, other.y);
      let minDistance = (this.size + other.size) / 2; // Minimum distance based on radii

      if (distance < minDistance) {
        // Push the bubbles apart
        let angle = atan2(this.y - other.y, this.x - other.x);
        let overlap = minDistance - distance;
        this.x += cos(angle) * overlap * 0.5;
        this.y += sin(angle) * overlap * 0.5;
        other.x -= cos(angle) * overlap * 0.5;
        other.y -= sin(angle) * overlap * 0.5;
      }
    }
  }

  display() {
    if (this.hasBurst) return;

    noFill(); // No fill for the circle, making it a ring
    stroke(0, 0, 100, this.opacity); // Use stroke for the ring color
    strokeWeight(1); // Adjust the thickness of the ring
    circle(this.x, this.y, this.size);
  }
}