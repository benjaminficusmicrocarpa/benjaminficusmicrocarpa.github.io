/**
 * Chart Animation Controller
 * Handles all chart and data visualization animations
 */
class ChartController {
    constructor() {
        this.charts = new Map();
        this.isInitialized = false;
        this.init();
    }

    init() {
        try {
            this.initTemperatureChart();
            this.initProgressBars();
            this.initMeters();
            this.initYieldChart();
            this.initProgressRings();
            this.isInitialized = true;
            console.log('ChartController initialized');
        } catch (error) {
            console.error('Failed to initialize ChartController:', error);
        }
    }

    initTemperatureChart() {
        const tempBars = document.querySelectorAll('.temp-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateTemperatureBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        tempBars.forEach(bar => observer.observe(bar));
    }

    animateTemperatureBars() {
        const tempBars = document.querySelectorAll('.temp-bar');
        tempBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.animation = 'temperatureRise 1s ease-out forwards';
            }, index * 200);
        });
    }

    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const percentage = bar.dataset.percentage;
                    setTimeout(() => {
                        bar.style.width = percentage + '%';
                    }, 100);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            bar.style.width = '0%';
            observer.observe(bar);
        });
    }

    initMeters() {
        const meters = document.querySelectorAll('.meter-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const meter = entry.target;
                    const percentage = meter.dataset.percentage;
                    this.animateMeter(meter, percentage);
                    observer.unobserve(meter);
                }
            });
        }, { threshold: 0.5 });

        meters.forEach(meter => observer.observe(meter));
    }

    animateMeter(meter, targetPercentage) {
        let currentPercentage = 0;
        const increment = targetPercentage / 100;
        
        const animate = () => {
            currentPercentage += increment;
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
            }
            
            const angle = (currentPercentage / 100) * 360;
            meter.style.background = `conic-gradient(
                var(--color-success) 0deg,
                var(--color-success) ${angle}deg,
                var(--color-background) ${angle}deg,
                var(--color-background) 360deg
            )`;
            
            if (currentPercentage < targetPercentage) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    initYieldChart() {
        const yieldBars = document.querySelectorAll('.yield-bar-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const yield_ = bar.dataset.yield;
                    const maxYield = 732; // Maximum yield for scaling
                    const height = (yield_ / maxYield) * 100;
                    
                    setTimeout(() => {
                        bar.style.height = height + 'px';
                    }, 200);
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        yieldBars.forEach(bar => {
            bar.style.height = '0px';
            observer.observe(bar);
        });
    }

    initProgressRings() {
        const rings = document.querySelectorAll('.ring-fill');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const ring = entry.target;
                    const progress = ring.dataset.progress;
                    ring.style.setProperty('--progress', progress);
                    observer.unobserve(ring);
                }
            });
        }, { threshold: 0.5 });

        rings.forEach(ring => observer.observe(ring));
    }

    // Pentagon chart animation
    initPentagonChart() {
        const pentagonAxes = document.querySelectorAll('.pentagon-axis');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    pentagonAxes.forEach((axis, index) => {
                        const value = axis.dataset.value;
                        const height = (value / 200) * 80; // Scale to max 80px
                        
                        setTimeout(() => {
                            axis.style.height = height + 'px';
                        }, index * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        if (pentagonAxes.length > 0) {
            observer.observe(pentagonAxes[0].parentElement);
        }
    }

    // Animate loss bars
    initLossBars() {
        const lossBars = document.querySelectorAll('.loss-bar');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lossBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.animation = 'lossBarGrow 0.8s ease-out forwards';
                        }, index * 200);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        if (lossBars.length > 0) {
            observer.observe(lossBars[0].parentElement);
        }
    }

    // Add dynamic chart updates
    updateChart(chartId, newData) {
        const chart = this.charts.get(chartId);
        if (chart) {
            // Update chart with new data
            chart.update(newData);
        }
    }

    destroy() {
        this.charts.clear();
        this.isInitialized = false;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartController;
}
