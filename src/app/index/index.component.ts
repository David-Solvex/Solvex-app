import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements AfterViewInit {
  @ViewChild('backgroundVideo') videoRef!: ElementRef<HTMLVideoElement>;
  isMenuOpen = false;
  isScrolled = false;
  private trails: {x: number, y: number, opacity: number}[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private cursorX = 0;
  private cursorY = 0;

  ngAfterViewInit() {
    this.setupVideoAutoplay();
    this.initializeLoadingScreen();
    this.initializeCursor();
    this.setupIntersectionObserver();
    this.setupEventListeners();
  }

  private setupVideoAutoplay() {
    const video = this.videoRef.nativeElement;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Autoplay no permitido:', error);
      });
    }
  }

private initializeLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');

  if (!loadingScreen || !mainContent) return;

  const totalDuration = Math.random() * 5000 + 2000;

  setTimeout(() => {
    loadingScreen.style.transition = 'opacity 0.5s ease-out';
    loadingScreen.style.opacity = '0';
    loadingScreen.style.pointerEvents = 'none';

    mainContent.style.transition = 'opacity 0.5s ease-in';
    mainContent.style.opacity = '1';
    mainContent.style.visibility = 'visible';

    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }, totalDuration);
}


  private initializeCursor() {
    const cursor = document.getElementById('customCursor');
    const trailElements = document.querySelectorAll('.cursor-trail');
    
    if (!cursor || trailElements.length === 0) return;

    cursor.classList.add('visible');
    this.trails = [];
    for (let i = 0; i < trailElements.length; i++) {
      this.trails.push({ x: 0, y: 0, opacity: 0 });
    }
    
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    this.animateCursor(cursor, trailElements);
    this.setupCursorEffects(cursor, trailElements);
  }

  private animateCursor(cursor: HTMLElement, trailElements: NodeListOf<Element>) {
    const animate = () => {
      this.cursorX += (this.mouseX - this.cursorX) * 0.15;
      this.cursorY += (this.mouseY - this.cursorY) * 0.15;
      
      cursor.style.left = `${this.cursorX}px`;
      cursor.style.top = `${this.cursorY}px`;
      
      this.trails.forEach((trail, index) => {
        const delay = (index + 1) * 0.05;
        trail.x += (this.cursorX - trail.x) * (0.15 - delay);
        trail.y += (this.cursorY - trail.y) * (0.15 - delay);
        trail.opacity = Math.max(0, 0.8 - index * 0.15);
        
        const element = trailElements[index] as HTMLElement;
        if (element) {
          element.style.left = `${trail.x}px`;
          element.style.top = `${trail.y}px`;
          element.style.opacity = `${trail.opacity}`;
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  private setupCursorEffects(cursor: HTMLElement, trailElements: NodeListOf<Element>) {
    const interactiveElements = document.querySelectorAll('a, button, .service-card, .value-card, .mv-card, .client-item, .nav-links li');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        trailElements.forEach(trail => {
          const el = trail as HTMLElement;
          el.style.transform = 'scale(1.5)';
          el.style.background = 'rgba(0, 210, 255, 0.6)';
        });
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        trailElements.forEach(trail => {
          const el = trail as HTMLElement;
          el.style.transform = 'scale(1)';
          el.style.background = 'var(--primary-color)';
        });
      });
    });

    document.addEventListener('mousedown', () => {
      cursor.classList.add('click');
      trailElements.forEach(trail => {
        (trail as HTMLElement).style.transform = 'scale(0.8)';
      });
    });

    document.addEventListener('mouseup', () => {
      cursor.classList.remove('click');
      trailElements.forEach(trail => {
        (trail as HTMLElement).style.transform = 'scale(1)';
      });
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      trailElements.forEach(trail => {
        (trail as HTMLElement).style.opacity = '0';
      });
    });

    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
    });
  }

  private setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          const cards = entry.target.querySelectorAll('.mv-card, .value-card, .service-card, .client-item');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('revealed');
            }, index * 150);
          });
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.section-reveal');
    sections.forEach(section => observer.observe(section));
  }

  private setupEventListeners() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-menu-overlay');
    
    if (hamburger) {
      hamburger.addEventListener('click', () => this.toggleMenu());
    }
    
    if (overlay) {
      overlay.addEventListener('click', () => this.toggleMenu());
    }

    // Smooth scrolling for mobile menu links
    
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      if (this.isMenuOpen) {
        hamburger.classList.add('active');
      } else {
        hamburger.classList.remove('active');
      }
    }
  }

  scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (element) {
    const navbarHeight = document.querySelector('.main-navbar')?.clientHeight || 0;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight;

    if (this.isMenuOpen) {
      this.toggleMenu(); // ✅ Cierra menú en móvil
    }

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

}