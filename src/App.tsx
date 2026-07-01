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
  description?: string;
  deliverables?: string[];
  actionText?: string;
  actionUrl?: string;
  colorTheme?: string;
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
    category: 'Community Engagement',
    description: 'We kicked off the regional transportation plan update by hosting facilitated discussion groups with a diverse selection of stakeholders, including residents, business owners, municipal planners, and environmental advocates. These groups highlighted current inequities in public transit access, voiced concerns over safety for cyclists and pedestrians, and identified key growth corridors requiring immediate transit upgrades.',
    deliverables: [
      'Conducted 12 regional stakeholder workshops',
      'Gathered feedback from over 150 local community leaders',
      'Published the Focus Group Summary Findings Report'
    ],
    actionText: 'Read Summary Report',
    actionUrl: '#',
    colorTheme: 'teal'
  },
  {
    id: 2,
    title: 'Public Survey & Interactive Comment Map Launch',
    period: 'May 2026 through July 2026',
    completed: true,
    phaseText: 'PHASE TWO',
    progress: 25.0,
    category: 'Digital Reach',
    description: 'To reach a wider audience across the region, we launched a web-based public survey alongside an interactive comment map. This digital tool allowed community members to drop pins directly onto a map of the region, noting specific problems like high-traffic bottlenecks, missing sidewalk linkages, unsafe intersections, or requested bus stop locations. The survey collected quantitative data on how residents commute, where they travel, and what goals they value most.',
    deliverables: [
      'Collected 3,200+ individual survey responses',
      'Mapped over 1,800 geo-tagged public comments',
      'Created open-source datasets for regional planners'
    ],
    actionText: 'Explore Interactive Map',
    actionUrl: '#',
    colorTheme: 'blue'
  },
  {
    id: 3,
    title: 'Public Involvement Meeting #1: Existing Conditions',
    period: 'June 2026',
    subtext: 'Two date & time options offered',
    completed: true,
    phaseText: 'PHASE THREE',
    progress: 37.5,
    category: 'Public Forum',
    description: 'The first series of public meetings presented our findings on the "State of the Region." We shared data regarding road and bridge conditions, transit ridership trends, carbon emissions, and safety statistics from the past decade. Attendees participated in live polling and breakout room discussions to validate the data and ensure our baseline assessment aligns with the actual lived experience of regional travelers.',
    deliverables: [
      'Hosted 2 virtual sessions and 1 in-person town hall',
      'Engaged with 450+ active participants',
      'Compiled baseline data report on current regional infrastructure'
    ],
    actionText: 'View Meeting Recording',
    actionUrl: '#',
    colorTheme: 'indigo'
  },
  {
    id: 4,
    title: 'Public Involvement Meeting #2: Future Conditions',
    period: 'October 2026',
    subtext: 'Two date & time options offered',
    completed: false,
    phaseText: 'PHASE FOUR',
    progress: 50.0,
    category: 'Future Planning',
    description: 'Our next milestone focuses on mapping out what the region could look like in 2050. Planners will present projections of population expansion, jobs redistribution, and climate challenges. We will present three distinct investment scenarios: a "Roadway-focused" scenario, a "Transit-centric" scenario, and a "Balanced Growth" scenario. Public feedback will help choose which scenario or hybrid path becomes our main blueprint.',
    deliverables: [
      'Produce traffic congestion and emissions projections for 2050',
      'Release draft investment scenarios for public voting',
      'Publish detailed scenario impact briefs'
    ],
    actionText: 'Register for Meeting #2',
    actionUrl: '#',
    colorTheme: 'purple'
  },
  {
    id: 5,
    title: 'Draft Plan Released',
    period: 'January 2027',
    completed: false,
    phaseText: 'PHASE FIVE',
    progress: 62.5,
    category: 'Documentation',
    description: 'The culmination of our research, public feedback, and policy development will be packaged into the official Plan 2050 Draft. This document will detail specific projects (such as transit expansions, highway updates, and bicycle networks), project timelines, cost estimates, and potential funding sources. It will be made available in digital and print formats at public libraries and municipal buildings.',
    deliverables: [
      'Publish full-text draft plan and executive summary',
      'Create bilingual explanatory flyers and videos',
      'Distribute print drafts to 24 local library branches'
    ],
    actionText: 'Notify Me on Release',
    actionUrl: '#',
    colorTheme: 'amber'
  },
  {
    id: 6,
    title: 'Public Comment Period on Draft Plan Opens',
    period: 'January 2027',
    completed: false,
    phaseText: 'PHASE SIX',
    progress: 75.0,
    category: 'Legislation & Feedback',
    description: 'Once the draft is released, a formal 45-day public comment window will open. This is a critical legal and democratic step. All comments received will be officially logged, reviewed by the planning board, and included in the public record. Residents can submit feedback via email, an online comment portal, or by speaking at public hearings.',
    deliverables: [
      'Launch formal online comment collection portal',
      'Hold official public hearing sessions',
      'Review and catalogue all public submissions'
    ],
    actionText: 'Get Review Alerts',
    actionUrl: '#',
    colorTheme: 'rose'
  },
  {
    id: 7,
    title: 'Public Involvement Meeting #3: Draft Plan',
    period: 'January 2027',
    subtext: 'Two date & time options offered',
    completed: false,
    phaseText: 'PHASE SEVEN',
    progress: 87.5,
    category: 'Public Forum',
    description: 'During the comment window, we will host the final round of public meetings. Planners will walk through the draft plan, point out key changes resulting from earlier public input, and explain how to read the project lists. Staff will be on hand to take oral testimony and assist users in submitting formal written comments.',
    deliverables: [
      'Host 3 interactive draft walkthrough workshops',
      'Present live Q&A sessions with planning directors',
      'Facilitate on-site comment submission booths'
    ],
    actionText: 'Save the Date',
    actionUrl: '#',
    colorTheme: 'indigo'
  },
  {
    id: 8,
    title: 'Final Plan Adoption',
    period: 'April 2027',
    completed: false,
    phaseText: 'PHASE EIGHT',
    progress: 100.0,
    category: 'Adoption & Rollout',
    description: 'Following modifications based on the public comment period, the revised Plan 2050 will be presented to the Regional Transportation Board for official adoption. Adoption of this plan is a prerequisite for unlocking billions in federal and state infrastructure grants, paving the way for construction, design, and program rollouts to begin.',
    deliverables: [
      'Incorporate public revisions into the final plan',
      'Host board voting session broadcasted live',
      'Publish final plan and project prioritization schedule'
    ],
    actionText: 'View Voting Calendar',
    actionUrl: '#',
    colorTheme: 'emerald'
  }
]

function TimelineRow({
  item,
  index,
  isHovered,
  onHover,
  onClick
}: {
  item: TimelineItemData
  index: number
  isHovered: boolean
  onHover: (id: number | null) => void
  onClick: (item: TimelineItemData) => void
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
          <div 
            className="timeline-text-block"
            onClick={() => onClick(item)}
            tabIndex={0}
            role="button"
            aria-haspopup="dialog"
            aria-label={`View details for ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(item);
              }
            }}
          >
            <h2 className="platform-year">{item.phaseText}</h2>
            <h3 className="platform-name">
              {item.title}
              <span className={`status-tag-badge ${item.completed ? 'badge-completed' : 'badge-upcoming'}`}>
                {item.completed ? 'Completed' : 'Upcoming'}
              </span>
            </h3>
            <p className="platform-desc">{item.period}</p>
            {item.subtext && <p className="platform-subtext">{item.subtext}</p>}
            <div className="card-click-prompt">Click for details &rarr;</div>
          </div>
          {/* Column 2: Node Icon */}
          <div 
            className="timeline-node-card"
            onClick={() => onClick(item)}
            tabIndex={0}
            role="button"
            aria-haspopup="dialog"
            aria-label={`View details for ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(item);
              }
            }}
          >
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
          <div 
            className="timeline-node-card"
            onClick={() => onClick(item)}
            tabIndex={0}
            role="button"
            aria-haspopup="dialog"
            aria-label={`View details for ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(item);
              }
            }}
          >
            {getIcon(item.category)}
          </div>
          {/* Column 7: Text block right */}
          <div 
            className="timeline-text-block"
            onClick={() => onClick(item)}
            tabIndex={0}
            role="button"
            aria-haspopup="dialog"
            aria-label={`View details for ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(item);
              }
            }}
          >
            <h2 className="platform-year">{item.phaseText}</h2>
            <h3 className="platform-name">
              {item.title}
              <span className={`status-tag-badge ${item.completed ? 'badge-completed' : 'badge-upcoming'}`}>
                {item.completed ? 'Completed' : 'Upcoming'}
              </span>
            </h3>
            <p className="platform-desc">{item.period}</p>
            {item.subtext && <p className="platform-subtext">{item.subtext}</p>}
            <div className="card-click-prompt">Click for details &rarr;</div>
          </div>
        </>
      )}
    </div>
  )
}

function DetailsModal({ 
  item, 
  onClose 
}: { 
  item: TimelineItemData | null; 
  onClose: () => void 
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (item) {
      if (typeof dialog.showModal === 'function') {
        document.body.style.overflow = 'hidden'
        dialog.showModal()
      }
    } else {
      if (typeof dialog.close === 'function') {
        dialog.close()
      }
      document.body.style.overflow = ''
    }

    const handleClose = () => {
      onClose()
      document.body.style.overflow = ''
    }
    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('close', handleClose)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = dialogRef.current?.getBoundingClientRect()
    if (!rect) return
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    )
    if (!isInDialog) {
      onClose()
    }
  }

  return (
    <dialog 
      ref={dialogRef} 
      className="details-dialog" 
      onClick={handleBackdropClick}
      aria-labelledby="modal-title"
    >
      <div className={`modal-content theme-${item.colorTheme}`}>
        <button 
          className="modal-close-btn" 
          onClick={onClose} 
          aria-label="Close details"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-header">
          <div className="modal-badge-row">
            <span className="modal-phase">{item.phaseText}</span>
            <span className="modal-category">{item.category}</span>
            {item.completed ? (
              <span className="status-pill pill-completed">Completed</span>
            ) : (
              <span className="status-pill pill-upcoming">Upcoming</span>
            )}
          </div>
          <h2 id="modal-title" className="modal-title">{item.title}</h2>
          <p className="modal-period">{item.period}</p>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h3 className="section-subtitle-small">About this Phase</h3>
            <p className="modal-description">{item.description}</p>
          </div>

          {item.deliverables && item.deliverables.length > 0 && (
            <div className="modal-section">
              <h3 className="section-subtitle-small">Key Deliverables & Outcomes</h3>
              <ul className="modal-deliverables-list">
                {item.deliverables.map((del, i) => (
                  <li key={i} className="deliverable-item">
                    <span className="bullet-icon">✓</span>
                    <span className="deliverable-text">{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {item.actionText && (
          <div className="modal-footer">
            <a 
              href={item.actionUrl || '#'} 
              className="modal-cta-btn" 
              onClick={(e) => {
                e.preventDefault();
                alert(`Action: "${item.actionText}" selected for ${item.title}`);
              }}
            >
              {item.actionText}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="cta-arrow-icon">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </dialog>
  )
}

function App() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<TimelineItemData | null>(null)

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
                onClick={setSelectedItem}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Details Modal */}
      <DetailsModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  )
}

export default App
