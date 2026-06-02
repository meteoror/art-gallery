import './style.css'

// ── Placeholder images (2000x1500 ratio = 4:3) via picsum.photos ──
const SLIDE_IMAGES: { src: string; alt: string }[] = [
  { src: '/0001.png', alt: 'Artwork 1' },
  { src: '/0002.png', alt: 'Artwork 2' },
  { src: '/0003.png', alt: 'Artwork 3' },
  { src: '/0004.png', alt: 'Artwork 4' },
  { src: '/0005.png', alt: 'Artwork 5' },
  { src: '/0006.png', alt: 'Artwork 6' },
]

const TEXT = `"Upend" is a theoretical, digitally rendered artwork that discusses and paints a metaphorical image of the "War on Drugs" perpetrated by the former Filipino president, Rodrigo Duterte, by using an image of all the furniture in one apartment compacted into a large tower in the middle of the room. This is meant to, symbolically, portray both the "upending" of one's life after the unjust killings so common during this time, and to physically represent the state of disarray that these "drug busts" very likely left apartments in. The piece is a commentary on the cruelty, corruption, and impunity that defined Duterte's administration, and the devastating impact it had on the people of the Philippines. 

Rodrigo Duterte was elected as president of the Philippines on May 9th, 2016. One of the campaign promises he ran on was a "war on drugs," where he said that his administration would "shoot dead" drug criminals. When he assumed power, he put into place a system in which police were incentivized to commit extrajudicial killings and were immune to any consequences. What followed was the mass killing of thousands of suspected drug users and sellers, those targeted as alleged drug users were often the poor or marginalized of the Philippines. The police of the Philippines worked off of unverified lists of possible drug criminals and routinely falsified incident reports to justify their killings. Placing guns in the hands of drug criminals and claiming to have been attacked first was a common tactic to avoid any accountability for killing people, and to this day, no police officers have been prosecuted following fatal shootings. Duterte's campaign of cruelty and corruption also targeted his critics, many people who attempted to speak out against or reveal the corruption in the Philippine police system were harassed, jailed, or killed. Duterte also tried to hide his administration's crimes from the entire world, by pulling the Philippines out of the International Criminal Court when they began to investigate the Philippines. In the end, Duterte was arrested for murder as a crime against humanity in 2025, and drug use rates failed to fall during his "war on drugs."

Duterte's administration didn't just allow police to act outside the bounds of the law, it encouraged it. Investigative reports and legislative hearings revealed a system in which officers were paid for each drug suspect killed. This created a monetary incentive to kill, while Duterte's promises of impunity meant that any possible consequences for killing citizens was removed. Beyond a monetary incentive, Duterte also provided a moral incentive. Duterte often demonized drug criminals in his speeches, and claimed that killing drug criminals was worth it for the "greater good" of a drug free society. With these protections, incentives, and absolutions, Duterte effectively institutionalized the murder of the poor and downtrodden of the Philippines.

Duterte didn't take kindly to anyone opposing his rule or investigating the widespread corruption in his administration, so he often used his place as president to authorize the harassment, arrest, or killing of critics and journalists. Both Leila de Lima and Maria Ressa were just some of the people targeted by Duterte. Leila de Lima was elected to the Senate of the Philippines in May 2016, and she was arrested in February 2017 on falsified drug charges. Leila was a critic of Duterte's war on drugs since the beginning, and had participated in an investigation into Duterte and his police prior to her arrest. De Lima was jailed for over 6 years, finally being released in 2024. Her arrest was a blatant attempt to scare her away from challenging those in power, but since being released, de Lima has returned to politics and been elected as the leader of one of the Philippines major political parties. Maria Ressa is an investigative journalist and CEO of the news site Rappler. During Duterte's "war on drugs," she exposed Duterte's extrajudicial killings and devoted herself to restlessly covering his crimes, despite numerous instances of state-sponsored harassment and false arrests. Ressa would win the Nobel prize for her tireless work in holding Duterte accountable.

Before he was elected as President of the Philippines, Rodrigo Duterte was Mayor of Davao City, which is the third-most populous city in the Philippines with a population of 1.85 million people. While Mayor of Davao City, Duterte encouraged specific police officers to kill criminals. The police he encouraged became known as the Davao Death Squad. Duterte denied any involvement with the DDS for decades, until he began his campaign for president, when he flaunted his founding of the Death Squad, claiming that his tactics of killing criminals were what made Davao City the ninth safest city on Earth. He promised that, if elected President, he'd kill 100,000 more criminals and dump their bodies in Manilla Bay. Duterte refused to report any of the specifics of his involvement with the Death Squad until a 2024 legislative hearing, in which he admitted that he had a special group of 7 highly-trained operatives that he had carry out specific assassinations of criminals, and that he instructed Davao police to intentionally "encourage suspects to fight back" so that the police would be legally justified in killing the criminals. Human rights organizations have estimated that between 1000 and 1400 petty thieves, street children, and suspected drug users were killed during Duterte's Mayorship, lasting from 1998 to 2016. This behavior and style of leadership has become a pattern for Duterte, when he became president, he implemented similar systems encouraging and incentivizing murder for police. The "Davao Model," as it was called, was applied to the whole of the Philippines and led to death and suffering on a national scale rather than a city-wide one.

Today, the Philippines is considered one of the safest countries for travellers in South Asia. However, the actual residents of the Philippines are still suffering. Duterte's reign of terror left thousands of families broken, and as many as 30,000 people dead. The poor communities of the Philippines were hit the hardest, and are now devastated. Duterte allowed the police to run amok and gun as many people down as they could justify, and now the family of those victims are left with no reparations and no one besides Duterte held accountable. There are mass murderers serving on the Philippine police right now, allowed to keep working despite the innocent blood on their hands. Duterte is currently undergoing a legal battle with the ICC and has been charged with crimes against humanity. Duterte being punished is some form of consequence, but the boots on the ground that actually perpetrated all of these murders have yet to be brought to justice.`

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
              ${TEXT.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('')}
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
