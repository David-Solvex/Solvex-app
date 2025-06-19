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

  ngAfterViewInit() {
    this.setupVideoAutoplay();
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    
    // Bloquear el scroll del body cuando el menú está abierto
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = document.querySelector('.main-navbar')?.clientHeight || 0;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      // Cerrar el menú móvil si está abierto
      if (this.isMenuOpen) {
        this.toggleMenu();
      }

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}