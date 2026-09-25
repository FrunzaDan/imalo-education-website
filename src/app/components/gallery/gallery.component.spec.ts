import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { GalleryImage } from '../../interfaces/gallery-image';
import { GalleryCatalogService } from '../../services/gallery-catalog.service';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
  let component: GalleryComponent;

  const images: readonly GalleryImage[] = [
    { imagePath: '/a.jpg' },
    { imagePath: '/b.jpg' },
    { imagePath: '/c.jpg' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GalleryCatalogService,
          useValue: {
            images: signal(images),
            hasLoadError: signal(false),
          },
        },
      ],
    });

    component = TestBed.createComponent(GalleryComponent).componentInstance;
  });

  it('shows the images from the catalog', () => {
    expect(component.galleryImageList()).toEqual(images);
  });

  it('opens the full view at the clicked index', () => {
    component.openFullView(1);

    expect(component.isFullViewOpen()).toBe(true);
    expect(component.currentIndex()).toBe(1);
  });

  it('closes the full view without resetting the index', () => {
    component.openFullView(1);
    component.closeFullView();

    expect(component.isFullViewOpen()).toBe(false);
    expect(component.currentIndex()).toBe(1);
  });

  it('does not navigate left past the first image', () => {
    component.openFullView(0);

    component.navigateLeft();

    expect(component.currentIndex()).toBe(0);
  });

  it('does not navigate right past the last image', () => {
    component.openFullView(images.length - 1);

    component.navigateRight();

    expect(component.currentIndex()).toBe(images.length - 1);
  });

  it('steps between images within bounds', () => {
    component.openFullView(1);

    component.navigateRight();
    expect(component.currentIndex()).toBe(2);

    component.navigateLeft();
    component.navigateLeft();
    expect(component.currentIndex()).toBe(0);
  });

  it('navigates with the arrow keys only while the full view is open', () => {
    component.openFullView(1);

    component.handleKeyboardEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight' }),
    );
    expect(component.currentIndex()).toBe(2);

    component.handleKeyboardEvent(
      new KeyboardEvent('keydown', { key: 'Escape' }),
    );
    expect(component.isFullViewOpen()).toBe(false);

    component.handleKeyboardEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
    );
    expect(component.currentIndex()).toBe(2);
  });
});
