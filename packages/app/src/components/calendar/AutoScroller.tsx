export class AutoScroller {
  private isTracking = false;
  private startY = 0;
  private startX = 0;
  private lastY = 0;
  private lastX = 0;
  private velocityY = 0;
  private velocityX = 0;
  private lastTime = 0;
  private animationId: number | null = null;
  private direction: "vertical" | "horizontal";
  private friction: number;

  constructor(
    public readonly onUpdate: (delta: number) => void,
    options?: {
      direction?: "vertical" | "horizontal";
      friction?: number;
    }
  ) {
    this.direction = options?.direction || "vertical";
    this.friction = options?.friction || 0.92; // Friction coefficient, controls deceleration speed, 0.92 means 8% speed reduction per 16ms
  }

  start(pos: { x: number; y: number }) {
    // Stop current inertia scrolling
    this.stopInertia();
    
    this.isTracking = true;
    this.startY = pos.y;
    this.startX = pos.x;
    this.lastY = this.startY;
    this.lastX = this.startX;
    this.lastTime = Date.now();
    this.velocityY = 0;
    this.velocityX = 0;
  }

  move(pos: { x: number; y: number }) {
    if (!this.isTracking) return;
    
    const currentY = pos.y;
    const currentX = pos.x;
    const currentTime = Date.now();
    
    // Calculate velocity (pixels/millisecond)
    const deltaTime = currentTime - this.lastTime;
    if (deltaTime > 0) {
      this.velocityY = (currentY - this.lastY) / deltaTime;
      this.velocityX = (currentX - this.lastX) / deltaTime;
    }
    
    // Calculate displacement
    const deltaY = currentY - this.lastY;
    const deltaX = currentX - this.lastX;
    
    // Call onUpdate based on direction
    if (this.direction === "vertical") {
      this.onUpdate(deltaY);
    } else {
      this.onUpdate(deltaX);
    }
    
    this.lastY = currentY;
    this.lastX = currentX;
    this.lastTime = currentTime;
  }

  end() {
    if (!this.isTracking) return;
    
    this.isTracking = false;
    
    // Start inertia scrolling
    this.startInertia();
  }

  private startInertia() {
    const velocity = this.direction === "vertical" ? this.velocityY : this.velocityX;
    
    // If velocity is too small, don't start inertia scrolling
    if (Math.abs(velocity) < 0.01) return;
    
    let currentVelocity = velocity;
    let lastFrameTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastFrameTime;
      lastFrameTime = currentTime;
      
      // Apply friction deceleration
      currentVelocity *= this.friction ** (deltaTime / 16); // Normalized based on 16ms
      
      // Calculate displacement for this frame
      const delta = currentVelocity * deltaTime;
      
      // Call update function
      this.onUpdate(delta);
      
      // If velocity is small enough, stop animation
      if (Math.abs(currentVelocity) > 0.01) {
        this.animationId = requestAnimationFrame(animate);
      }
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  private stopInertia() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // Cleanup method, call when component unmounts
  destroy() {
    this.stopInertia();
    this.isTracking = false;
  }
}
