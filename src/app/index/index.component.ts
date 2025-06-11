import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements AfterViewInit {
  @ViewChild('backgroundVideo') videoRef!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    this.setupVideoAutoplay();
  }

  private setupVideoAutoplay() {
    const video = this.videoRef.nativeElement;
    
    // Configuración esencial para autoplay
    video.muted = true;
    video.loop = true;
    video.playsInline = true; // Para iOS
    
    // Intentar reproducir automáticamente
    const playPromise = video.play();
    
    // Manejar posibles errores de autoplay
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn('Autoplay no permitido:', error);
        // Aquí podrías mostrar un botón de play manual
      });
    }
  }
}