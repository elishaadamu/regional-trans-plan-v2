import { useState, useEffect, useRef } from 'react'
import './App.css'

interface TimelineItemData {
  id: number;
  title: string;
  period: string;
  subtext?: string;
  completed: boolean;
  phaseText: string;
  progress: number;
  category: string;
}

// High-fidelity Solid brand-colored SVGs
const FocusGroupsIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1e2538" className="brand-svg-icon" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
)

const MapSurveyIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1e2538" className="brand-svg-icon" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)

const PublicMeetingIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1e2538" className="brand-svg-icon" aria-hidden="true">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
  </svg>
)

const FuturePlanningIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1e2538" className="brand-svg-icon" aria-hidden="true">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
  </svg>
)

const DraftPlanIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1e2538" className="brand-svg-icon" aria-hidden="true">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
  </svg>
)

const CommentPeriodIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1e2538" className="brand-svg-icon" aria-hidden="true">
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z"/>
  </svg>
)

const PlanAdoptionIcon = () => (
  <svg viewBox="0 0 24 24" fill="#1e2538" className="brand-svg-icon" aria-hidden="true">
    <path d="M12 2C11.95 2 12 2 12 2 8.69 2 6 4.69 6 8c0 1.86.85 3.53 2.18 4.66L7 22l5-3 5 3-1.18-9.34C17.15 11.53 18 9.86 18 8c0-3.31-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
  </svg>
)

const HourglassIcon = () => (
  <svg viewBox="0 0 24 24" width="36" height="36" className="header-hourglass-svg" aria-hidden="true">
    {/* Frame top & bottom */}
    <rect x="4" y="2" width="16" height="2" rx="0.5" fill="#e28743" />
    <rect x="4" y="20" width="16" height="2" rx="0.5" fill="#e28743" />
    {/* Side pillars */}
    <line x1="5" y1="4" x2="5" y2="20" stroke="#e28743" strokeWidth="1.5" />
    <line x1="19" y1="4" x2="19" y2="20" stroke="#e28743" strokeWidth="1.5" />
    {/* Glass bulb bodies */}
    <path d="M6 4h12c0 6-3 7-3 8s3 2 3 8H6c0-6 3-7 3-8s-3-2-3-8z" fill="rgba(255, 255, 255, 0.15)" stroke="#ffffff" strokeWidth="1" />
    {/* Sand in top bulb */}
    <path d="M7 5.5h10c0 2-2 3.2-2 4.5s2 1.5 2 2H7c0-.5 2-.8 2-2s-2-2-2-4.5z" fill="#e05a47" />
    {/* Sand stream falling */}
    <line x1="12" y1="11" x2="12" y2="18" stroke="#e05a47" strokeWidth="1.5" strokeDasharray="2 1.5" />
    {/* Sand accumulating in bottom bulb */}
    <path d="M8 19.5c0-1.8 1.8-2.5 4-2.5s4 .7 4 2.5z" fill="#e05a47" />
  </svg>
)

const timelineData: TimelineItemData[] = [
  {
    id: 1,
    title: 'RTP Focus Groups Begin',
    period: 'April 2026 through July 2026',
    completed: true,
    phaseText: 'PHASE ONE',
    progress: 12.5,
    category: 'Community Engagement'
  },
  {
    id: 2,
    title: 'Public Survey & Interactive Comment Map Launch',
    period: 'May 2026 through July 2026',
    completed: true,
    phaseText: 'PHASE TWO',
    progress: 25.0,
    category: 'Digital Reach'
  },
  {
    id: 3,
    title: 'Public Involvement Meeting #1: Existing Conditions',
    period: 'June 2026',
    subtext: 'Two date & time options offered',
    completed: true,
    phaseText: 'PHASE THREE',
    progress: 37.5,
    category: 'Public Forum'
  },
  {
    id: 4,
    title: 'Public Involvement Meeting #2: Future Conditions',
    period: 'October 2026',
    subtext: 'Two date & time options offered',
    completed: false,
    phaseText: 'PHASE FOUR',
    progress: 50.0,
    category: 'Future Planning'
  },
  {
    id: 5,
    title: 'Draft Plan Released',
    period: 'January 2027',
    completed: false,
    phaseText: 'PHASE FIVE',
    progress: 62.5,
    category: 'Documentation'
  },
  {
    id: 6,
    title: 'Public Comment Period on Draft Plan Opens',
    period: 'January 2027',
    completed: false,
    phaseText: 'PHASE SIX',
    progress: 75.0,
    category: 'Legislation & Feedback'
  },
  {
    id: 7,
    title: 'Public Involvement Meeting #3: Draft Plan',
    period: 'January 2027',
    subtext: 'Two date & time options offered',
    completed: false,
    phaseText: 'PHASE SEVEN',
    progress: 87.5,
    category: 'Public Forum'
  },
  {
    id: 8,
    title: 'Final Plan Adoption',
    period: 'April 2027',
    completed: false,
    phaseText: 'PHASE EIGHT',
    progress: 100.0,
    category: 'Adoption & Rollout'
  }
]

function TimelineRow({
  item,
  index,
  isHovered,
  onHover
}: {
  item: TimelineItemData
  index: number
  isHovered: boolean
  onHover: (id: number | null) => void
}) {
  const [inView, setInView] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [])

  const isLeft = index % 2 === 0

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Community Engagement': return <FocusGroupsIcon />
      case 'Digital Reach': return <MapSurveyIcon />
      case 'Public Forum': return <PublicMeetingIcon />
      case 'Future Planning': return <FuturePlanningIcon />
      case 'Documentation': return <DraftPlanIcon />
      case 'Legislation & Feedback': return <CommentPeriodIcon />
      case 'Adoption & Rollout': return <PlanAdoptionIcon />
      default: return <PublicMeetingIcon />
    }
  }

  return (
    <div
      ref={elementRef}
      className={`timeline-row ${isLeft ? 'row-left' : 'row-right'} ${inView ? 'in-view' : ''} ${
        item.completed ? 'status-completed' : 'status-upcoming'
      } ${isHovered ? 'row-hovered' : ''}`}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      id={`timeline-row-${item.id}`}
    >
      {isLeft ? (
        <>
          {/* Column 1: Text block left */}
          <div className="timeline-text-block">
            <h2 className="platform-year">{item.phaseText}</h2>
            <h3 className="platform-name">
              {item.title}
              <span className={`status-tag-badge ${item.completed ? 'badge-completed' : 'badge-upcoming'}`}>
                {item.completed ? 'Completed' : 'Upcoming'}
              </span>
            </h3>
            <p className="platform-desc">{item.period}</p>
            {item.subtext && <p className="platform-subtext">{item.subtext}</p>}
          </div>
          {/* Column 2: Node Icon */}
          <div className="timeline-node-card">
            {getIcon(item.category)}
          </div>
          {/* Column 3: Connector line */}
          <div className="timeline-connector-branch"></div>
        </>
      ) : (
        <>
          {/* Column 5: Connector line */}
          <div className="timeline-connector-branch"></div>
          {/* Column 6: Node Icon */}
          <div className="timeline-node-card">
            {getIcon(item.category)}
          </div>
          {/* Column 7: Text block right */}
          <div className="timeline-text-block">
            <h2 className="platform-year">{item.phaseText}</h2>
            <h3 className="platform-name">
              {item.title}
              <span className={`status-tag-badge ${item.completed ? 'badge-completed' : 'badge-upcoming'}`}>
                {item.completed ? 'Completed' : 'Upcoming'}
              </span>
            </h3>
            <p className="platform-desc">{item.period}</p>
            {item.subtext && <p className="platform-subtext">{item.subtext}</p>}
          </div>
        </>
      )}
    </div>
  )
}

function App() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <div className="app-container">
      {/* Premium Sticky Navigation Header */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo-section">
            <span className="logo-dot"></span>
            <span className="logo-text">Plan 2050</span>
          </div>
          <nav className="header-nav">
            <a href="#timeline-section" className="nav-link active">Plan Timeline</a>
          </nav>
        </div>
      </header>

      {/* Timeline Section */}
      <section id="timeline-section" className="timeline-section">
        
        {/* Infographic Header styling inside the section */}
        <header className="timeline-header">
          <div className="header-content">
            <HourglassIcon />
            <h1>TIMELINE</h1>
            <HourglassIcon />
          </div>
          <div className="header-divider"></div>
          <p className="header-subtitle">Plan 2050: Regional Transportation Plan Roadmap</p>
        </header>

        <div className="timeline-container">
          {/* Central backbone vertical line */}
          <div className="timeline-backbone-line" style={{
            background: hoveredId 
              ? `linear-gradient(to bottom, var(--sm-teal) 0%, var(--sm-teal) ${(hoveredId / 8) * 100}%, #334155 ${(hoveredId / 8) * 100}%, #334155 100%)`
              : 'var(--sm-teal)'
          }}></div>

          <div className="timeline-grid">
            {timelineData.map((item, index) => (
              <TimelineRow
                key={item.id}
                item={item}
                index={index}
                isHovered={hoveredId === item.id}
                onHover={setHoveredId}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
