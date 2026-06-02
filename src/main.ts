import './style.css'

// ── Placeholder images (2000x1500 ratio = 4:3) via picsum.photos ──
const SLIDE_IMAGES: { src: string; alt: string }[] = [
  { src: '/assets/renders/0001.jpg', alt: 'Artwork 1' },
  { src: '/assets/renders/0002.jpg', alt: 'Artwork 2' },
  { src: '/assets/renders/0003.jpg', alt: 'Artwork 3' },
  { src: '/assets/renders/0004.jpg', alt: 'Artwork 4' },
  { src: '/assets/renders/0005.jpg', alt: 'Artwork 5' },
  { src: '/assets/renders/0006.jpg', alt: 'Artwork 6' },
]

const LOREM_PARAGRAPHS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
  `Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.`,
  `Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt.`,
  `Ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.`,
  `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.`,
]

class ArtGallery {
  private currentIndex = 0
  private isAnimating = false
  private sidebarOpen = false

  // DOM refs
  private track!: HTMLElement
  private pips!: NodeListOf<HTMLElement>
  private sidebar!: HTMLElement
  private overlay!: HTMLElement
  private cursorDot!: HTMLElement
  private cursorRing!: HTMLElement

  constructor() {
    this.render()
    this.bindEvents()
  }

  private render() {
    const app = document.getElementById('app')!
    app.innerHTML = `
      <!-- Cursor -->
      <div class="cursor cursor-dot" id="cursorDot"></div>
      <div class="cursor cursor-ring" id="cursorRing"></div>

      <!-- Gallery Frame -->
      <div class="gallery-frame" id="galleryFrame">

        <!-- Info Button -->
        <button class="info-btn" id="infoBtn" aria-label="About this piece">i</button>

        <!-- Click Zones -->
        <div class="click-zone click-zone-left" id="zoneLeft"></div>
        <div class="click-zone click-zone-right" id="zoneRight"></div>

        <!-- Carousel -->
        <div class="carousel-track" id="carouselTrack">
          ${SLIDE_IMAGES.map((img, i) => `
            <div class="carousel-slide" data-index="${i}">
              <img src="${img.src}" alt="${img.alt}" draggable="false" loading="${i === 0 ? 'eager' : 'lazy'}" />
            </div>
          `).join('')}
        </div>

        <!-- Dot Counter -->
        <div class="slide-counter" id="slideCounter">
          ${SLIDE_IMAGES.map((_, i) => `
            <div class="counter-pip${i === 0 ? ' active' : ''}" data-pip="${i}"></div>
          `).join('')}
        </div>

        <!-- Sidebar Overlay -->
        <div class="sidebar-overlay" id="sidebarOverlay"></div>

        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar" aria-hidden="true">
          <button class="sidebar-close" id="sidebarClose" aria-label="Close">✕</button>
          <div class="sidebar-inner">
            <div class="sidebar-rule"></div>
            <div class="sidebar-text">
              ${LOREM_PARAGRAPHS.map(p => `<p>${p}</p>`).join('')}
            </div>
          </div>
        </aside>

      </div>
    `

    this.track = document.getElementById('carouselTrack')!
    this.pips = document.querySelectorAll('[data-pip]')
    this.sidebar = document.getElementById('sidebar')!
    this.overlay = document.getElementById('sidebarOverlay')!
    this.cursorDot = document.getElementById('cursorDot')!
    this.cursorRing = document.getElementById('cursorRing')!
  }

  private bindEvents() {
    // Cursor tracking
    document.addEventListener('mousemove', (e) => this.onMouseMove(e))
    document.addEventListener('mouseleave', () => {
      this.cursorDot.style.opacity = '0'
      this.cursorRing.style.opacity = '0'
    })
    document.addEventListener('mouseenter', () => {
      this.cursorDot.style.opacity = '1'
      this.cursorRing.style.opacity = '1'
    })

    // Click zones
    const zoneLeft = document.getElementById('zoneLeft')!
    const zoneRight = document.getElementById('zoneRight')!

    zoneLeft.addEventListener('click', () => this.navigate('prev'))
    zoneRight.addEventListener('click', () => this.navigate('next'))

    zoneLeft.addEventListener('mouseenter', () => this.setCursorArrow('left'))
    zoneLeft.addEventListener('mouseleave', () => this.setCursorArrow(null))
    zoneRight.addEventListener('mouseenter', () => this.setCursorArrow('right'))
    zoneRight.addEventListener('mouseleave', () => this.setCursorArrow(null))

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.navigate('prev')
      if (e.key === 'ArrowRight') this.navigate('next')
      if (e.key === 'Escape' && this.sidebarOpen) this.closeSidebar()
    })

    // Touch / swipe
    let touchStartX = 0
    let touchStartY = 0
    const frame = document.getElementById('galleryFrame')!

    frame.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }, { passive: true })

    frame.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        this.navigate(dx < 0 ? 'next' : 'prev')
      }
    }, { passive: true })

    // Info button
    document.getElementById('infoBtn')!.addEventListener('click', () => this.openSidebar())
    document.getElementById('sidebarClose')!.addEventListener('click', () => this.closeSidebar())
    this.overlay.addEventListener('click', () => this.closeSidebar())
  }

  private onMouseMove(e: MouseEvent) {
    this.cursorDot.style.left = `${e.clientX}px`
    this.cursorDot.style.top = `${e.clientY}px`
    this.cursorRing.style.left = `${e.clientX}px`
    this.cursorRing.style.top = `${e.clientY}px`
  }

  private setCursorArrow(dir: 'left' | 'right' | null) {
    this.cursorRing.classList.remove('arrow-left', 'arrow-right', 'expanded')
    if (dir === 'left') {
      this.cursorRing.classList.add('expanded')       // removed 'arrow-left'
    } else if (dir === 'right') {
      this.cursorRing.classList.add('expanded')       // removed 'arrow-right'
    }
  }

  private navigate(dir: 'prev' | 'next') {
    if (this.isAnimating) return
    const count = SLIDE_IMAGES.length

    if (dir === 'next') {
      this.currentIndex = (this.currentIndex + 1) % count
    } else {
      this.currentIndex = (this.currentIndex - 1 + count) % count
    }

    this.updateCarousel()
  }

  private updateCarousel() {
    this.isAnimating = true
    this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`

    // Update pips
    this.pips.forEach((pip, i) => {
      pip.classList.toggle('active', i === this.currentIndex)
    })

    this.track.addEventListener('transitionend', () => {
      this.isAnimating = false
    }, { once: true })
  }

  private openSidebar() {
    this.sidebarOpen = true
    this.sidebar.classList.add('open')
    this.sidebar.setAttribute('aria-hidden', 'false')
    this.overlay.classList.add('active')
  }

  private closeSidebar() {
    this.sidebarOpen = false
    this.sidebar.classList.remove('open')
    this.sidebar.setAttribute('aria-hidden', 'true')
    this.overlay.classList.remove('active')
  }
}

new ArtGallery()
