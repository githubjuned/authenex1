
export class FraudDetector {
  static getDeviceFingerprint(): string {
    const components = [
      navigator.userAgent,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      (navigator as any).deviceMemory || 'unknown',
      (navigator as any).hardwareConcurrency || 'unknown'
    ];
    // Simple hash for demo
    return btoa(components.join('|')).substring(0, 32);
  }

  private static keyTimestamps: number[] = [];

  static recordKeypress() {
    this.keyTimestamps.push(Date.now());
    if (this.keyTimestamps.length > 20) this.keyTimestamps.shift();
  }

  static getBehaviorMetrics() {
    if (this.keyTimestamps.length < 2) return { typingSpeed: 0 };
    
    let total = 0;
    for (let i = 1; i < this.keyTimestamps.length; i++) {
      total += this.keyTimestamps[i] - this.keyTimestamps[i - 1];
    }
    const avgSpeed = total / (this.keyTimestamps.length - 1);
    
    return {
      typingSpeed: avgSpeed, // Lower is faster typing
      botLikely: avgSpeed < 10 // Humanly impossible speed
    };
  }
}
