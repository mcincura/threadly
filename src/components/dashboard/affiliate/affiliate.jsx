import './affiliate.css';
import './noAff.css';
import './aff.css';
import AffRewardsGraph from '../../ui/affGraph/affGraph';
import DotGrid from '../../ui/dotGrid/dotgrid';
import AffiliateTitle from './subComp/affTitle';
import AffiliateSubtitle from './subComp/affSub';
import AffiliateStatsChart from '../../ui/affChart/affChart';
import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import Stepper, { Step } from '../../ui/stepper/stepper';
import axios from 'axios';

const Affiliate = ({ user, loggedIn }) => {

  const [isAff, setIsAff] = useState(null);

  const title = !isAff
    ? "Become an Affiliate"
    : `Welcome Back, ${user && user.user.username ? user.user.username : "Affiliate"}!`;

  const subtitle = !isAff
    ? "Earn 50% commission from each sale and recurring sales!"
    : "Monitor your commissions and performance here.";

  const [isLight, setIsLight] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [linkAvailable, setLinkAvailable] = useState(true);
  const [linkError, setLinkError] = useState('');
  const debounceRef = useRef();
  const [agreeEmail, setAgreeEmail] = useState(false);
  const [agreeTos, setAgreeTos] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const divRef = useRef(null);
  const marginTop = divRef.current ? divRef.current.offsetWidth * 0.05 : 35;
  const [affiliateStatsBreakdown, setAffiliateStatsBreakdown] = useState(null);
  const [link, setLink] = useState(null);
  const [topAffiliates, setTopAffiliates] = useState([]);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [copyStatus, setCopyStatus] = useState("COPY");
  const [changeStatus, setChangeStatus] = useState("CHANGE");

  const homepage = "http://localhost:3000";

  // Fetch top 10 affiliates on mount
  useEffect(() => {
    async function fetchTopAffiliates() {
      try {
        const res = await axios.get('http://localhost:3001/affiliate/top');
        if (res.data && Array.isArray(res.data.topAffiliates)) {
          // Convert amount to number if needed
          const affiliates = res.data.topAffiliates.map(a => ({
            ...a,
            amount: typeof a.amount === "string" ? parseFloat(a.amount) : a.amount
          }));
          setTopAffiliates(affiliates);
        }
      } catch (err) {
        setTopAffiliates([]);
        console.error("Failed to fetch top affiliates:", err);
      }
    }
    fetchTopAffiliates();
  }, []);

  // Fetch affiliate stats breakdown
  useEffect(() => {
    if (!user || !user.user || !user.user.id) return;
    axios.get(`http://localhost:3001/affiliate/stats/${user.user.id}`)
      .then(res => setAffiliateStatsBreakdown(res.data))
      .catch(() => setAffiliateStatsBreakdown(null));

    console.log("Fetched affiliate stats breakdown:", affiliateStatsBreakdown);
  }, [user]);

  //FUN - get current affiliate link
  useEffect(() => {
    if (user && user.user && user.user.id) {
      fetchAffiliateLink(user.user.id).then(link => {
        setLink(link);
      });
    }
  }, [user]);

  const handleChangeLink = async () => {
    if (!user || !user.user || !user.user.id) {
      setChangeStatus("FAILED");
      setTimeout(() => setChangeStatus("CHANGE"), 2000);
      return;
    }
    if (!linkAvailable || !name) {
      setChangeStatus("FAILED");
      setTimeout(() => setChangeStatus("CHANGE"), 2000);
      return;
    }
    try {
      const res = await axios.put('http://localhost:3001/affiliate/change-link', {
        id: user.user.id,
        newLink: name
      });
      setChangeStatus("UPDATED");
      setTimeout(() => setChangeStatus("CHANGE"), 2000);
      setLink(name); // update local state
      setName('');   // clear input
      setLinkError('');
      setLinkAvailable(true);
    } catch (err) {
      setChangeStatus("FAILED");
      setTimeout(() => setChangeStatus("CHANGE"), 2000);
    }
  };

  // Handler for final step submit
  const handleAffiliateSignup = async () => {
    if (!user.user || !user.user.id) {
      alert("User not found. Please log in.");
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/affiliate/signup', {
        id: user.user.id,
        link: name,
        email_report: agreeEmail
      });
      alert(res.data.message || "Successfully joined the affiliate program!");
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 300); // Give the modal time to hide before reload
    } catch (err) {
      alert(
        err.response?.data?.error ||
        "Signup to become affiliate failed."
      );
      setShowModal(false);
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  // Check link availability
  const checkLink = async (link) => {
    if (!link) {
      setLinkAvailable(true);
      setLinkError('');
      return;
    }
    try {
      const res = await axios.post('http://localhost:3001/affiliate/check-link', { link });
      if (res.data.available) {
        setLinkAvailable(true);
        setLinkError('');
      } else {
        setLinkAvailable(false);
        setLinkError('This link is already taken.');
      }
    } catch (err) {
      setLinkAvailable(false);
      setLinkError('Error checking link.');
    }
  };

  // Debounce link checking
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!name) {
      setLinkAvailable(true);
      setLinkError('');
      return;
    }
    debounceRef.current = setTimeout(() => {
      checkLink(name);
    }, 500);
    return () => clearTimeout(debounceRef.current);
  }, [name]);

  useEffect(() => {
    if (loggedIn && user && typeof user.user.isAff !== "undefined") {
      if (user.user.isAff === 0) {
        setIsAff(false);
      } else {
        setIsAff(true);
      }
    } else {
      setIsAff(false);
    }
  }, [user, loggedIn])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    setIsLight(mq.matches);

    const handler = (e) => setIsLight(e.matches);
    mq.addEventListener('change', handler);

    return () => mq.removeEventListener('change', handler);
  }, []);

  async function fetchAffiliateLink(userId) {
    if (!userId) return null;
    try {
      const res = await axios.get(`http://localhost:3001/affiliate/link/${userId}`);
      if (res.data && res.data.link) {
        return res.data.link;
      } else {
        return null;
      }
    } catch (err) {
      console.error("Failed to fetch affiliate link:", err);
      return null;
    }
  }

  const copyAffiliateLink = () => {
    if (!link) return;
    const fullLink = `${homepage}?ref=${link}`;
    navigator.clipboard.writeText(fullLink)
      .then(() => {
        setCopyStatus("COPIED");
        setTimeout(() => setCopyStatus("COPY"), 2000);
      })
      .catch(() => {
        setCopyStatus("FAILED");
        setTimeout(() => setCopyStatus("COPY"), 2000);
      });
  };

  function formatMoney(amount) {
    if (Math.abs(amount) >= 1_000_000) {
      return (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (Math.abs(amount) >= 1_000) {
      return (amount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return amount;
  }

  function truncateUsername(username, max = 14) {
    return username.length > max ? username.slice(0, max - 3) + "..." : username;
  }

  function TopAffiliatesTable({ affiliates }) {
    const containerRef = useRef(null);
    const theadRef = useRef(null);
    const [visibleRows, setVisibleRows] = useState(10);
    const [rowHeight, setRowHeight] = useState(48); // default min row height

    useEffect(() => {
      function updateRows() {
        if (!containerRef.current || !theadRef.current) return;
        const containerHeight = containerRef.current.offsetHeight;
        const theadHeight = theadRef.current.offsetHeight;
        const available = containerHeight - theadHeight;
        const minRowHeight = 48; // px, adjust as needed
        const rows = Math.floor(available / minRowHeight);
        setVisibleRows(rows);
        if (rows > 0) setRowHeight(available / rows);
      }
      updateRows();
      window.addEventListener("resize", updateRows);
      return () => window.removeEventListener("resize", updateRows);
    }, []);

    return (
      <div className="top-affiliates-table-scroll" ref={containerRef}>
        <table className="top-affiliates-table">
          <thead ref={theadRef}>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.slice(0, visibleRows).map((a, i) => (
              <tr key={a.username} style={{ height: `${rowHeight}px` }}>
                <td>{i + 1}</td>
                <td title={a.username}>{truncateUsername(a.username)}</td>
                <td>${formatMoney(a.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="affiliate-main">
      <div className="affiliate-content-wrapper">
        <div className="affiliate-section1-2-bg">
          <DotGrid
            dotSize={4}
            gap={15}
            baseColor={isLight ? "#c2b2de" : "#271E37"}
            activeColor={isLight ? "#883cf3" : "#883cf3"}
            proximity={200}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
        {/* Only render after isAff is determined */}
        {isAff !== null && (
          <div className="affiliate-section1">
            <AffiliateTitle isAff={isAff} text={title} />
            <AffiliateSubtitle isAff={isAff} text={subtitle} />
          </div>
        )}
        {isAff !== null && (
          <motion.div className="affiliate-section2"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 200 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="affiliate-section2-decoration">
              <div className="deco-dot first" />
              <div className="deco-dot second" />
              <div className="deco-dot third" />
            </div>
            {!isAff ? (
              <div className="NO-affiliate-section2-content">
                <div className='NO-affiliate-section2-content1'>
                  <motion.div className='NO-affiliate-section2-content1-left'
                    initial={{ opacity: 0, y: 300 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <h1>Turn Conversations into Conversions</h1>
                    <h3>Become an Affiliate Today</h3>
                    <button
                      onClick={() => setShowModal(true)}
                      className='affiliate-hero-cta-button'
                    >JOIN NOW</button>
                  </motion.div>
                  <motion.div className='NO-affiliate-section2-content1-right'
                    initial={{ opacity: 0, y: 300 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  >
                    <img
                      src={isLight ? './assets/images/cone.avif' : './assets/images/cone.avif'}
                      className={isLight ? 'NO-affiliate-cone-dark' : 'NO-affiliate-cone-dark'}
                    />
                  </motion.div>
                </div>
                <div className="NO-affiliate-section2-content2">
                  <div className="NO-affiliate-section2-content2-left">
                    <AffRewardsGraph />
                  </div>
                  <div className="NO-affiliate-section2-content2-right">
                    <h1>
                      Earn more than just money.
                    </h1>
                    <h3>Top performing affiliates earn exclusive rewards. Each month.</h3>
                  </div>
                </div>
                <div className="NO-affiliate-section2-content3">
                  <div className="NO-affiliate-cta-card">
                    <h1>Ready to Start Earning?</h1>
                    <button
                      className="affiliate-hero-cta-button"
                      onClick={() => setShowModal(true)}
                    >
                      JOIN NOW
                    </button>
                  </div>
                  <motion.div
                    className="NO-affiliate-section2-content3-decoration-left"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{
                      y: [0, -15, 0],
                      opacity: 1,
                      transition: {
                        y: {
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut"
                        },
                        opacity: { duration: 0.7, ease: "easeOut" }
                      }
                    }}
                  >
                    <img alt='cube-right' src={isLight ? './assets/images/cube.avif' : './assets/images/cube.avif'} />
                  </motion.div>
                  <motion.div
                    className="NO-affiliate-section2-content3-decoration-right"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{
                      y: [0, -15, 0],
                      opacity: 1,
                      transition: {
                        y: {
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut"
                        },
                        opacity: { duration: 0.7, ease: "easeOut" }
                      }
                    }}
                  >
                    <img alt='cube-right' src={isLight ? './assets/images/cube.avif' : './assets/images/cube.avif'} />
                  </motion.div>
                </div>

              </div>

            ) : (
              <div className="affiliate-section2-content">
                <div className="affiliate-section2-content1">
                  <h1>Lifetime Results</h1>
                  <div className="affiliate-content1-cards">
                    <div className="affiliate-content1-card">
                      <h3>Clicks</h3>
                      <p>{user.affiliateStats.clicks}</p>
                    </div>
                    <div className="affiliate-content1-card">
                      <h3>Signups</h3>
                      <p>{user.affiliateStats.signups}</p>
                    </div>
                    <div className="affiliate-content1-card">
                      <h3>Conversions</h3>
                      <p>{user.affiliateStats.conversions}</p>
                    </div>
                    <div className="affiliate-content1-card">
                      <h3>Commission</h3>
                      <p>{`${user.affiliateStats.commission_earned}$`}</p>
                    </div>
                    <div className="affiliate-content1-card">
                      <h3>Last Update</h3>
                      <p>        {user.affiliateStats.last_updated
                        ? new Date(user.affiliateStats.last_updated).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : '—'}</p>
                    </div>
                  </div>
                </div>
                <div className="affiliate-section2-content2">
                  <h1>Your Affiliate Performance</h1>
                  <div className="affiliate-content2-chart-wrapper">
                    <div className="affiliate-content2-chart-container">
                      <AffiliateStatsChart statsData={affiliateStatsBreakdown} />
                    </div>
                  </div>
                </div>
                <div className="affiliate-section2-content3" ref={divRef}
                  style={{ paddingBlock: `${marginTop}px` }}>
                  <div className="affiliate-section2-content3-container">
                    <div className="affiliate-section2-content3-left">
                      <h1>
                        Commissions
                      </h1>
                      <div className="aff-bento-grid">
                        <div className="aff-bento-card pending">
                          <h3>Commission Pending</h3>
                          <p>${user.affiliateStats.commission_pending}</p>
                        </div>
                        <div className="aff-bento-card earned">
                          <h3>Commission Earned</h3>
                          <p>${user.affiliateStats.commission_earned}</p>
                        </div>
                        <div className="aff-bento-card payout">
                          <h3>Payout Methods</h3>
                          <button>Manage Payouts</button>
                        </div>
                        <div className="aff-bento-card paid">
                          <h3>Commission Paid</h3>
                          <p>${user.affiliateStats.commission_paid}</p>
                        </div>
                      </div>
                    </div>
                    <div className="affiliate-section2-content3-right">
                      <h1>
                        Top Affiliates
                      </h1>
                      <div className="affiliate-content3-top-affiliates">
                        <TopAffiliatesTable affiliates={topAffiliates} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="affiliate-section2-content4"
                  style={{ paddingBottom: `${marginTop}px` }}>
                  <div className="affiliate-section2-content4-container">
                    <h1>Link Management</h1>
                    <div className="affiliate-section2-content4-wrapper">
                      <div className="current-link-container">
                        <p className="change-link-header">Your current affiliate link:</p>
                        <p>{link ? `${homepage}?ref=${link}` : ''}</p>
                        <button onClick={copyAffiliateLink}>{copyStatus}</button>
                      </div>
                      <div className="change-link-container">
                        <p className="change-link-header">Change your link</p>
                        <input
                          className="change-link-input"
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Enter new affiliate link"
                          autoComplete="off"
                        />
                        {linkError && (
                          <div className="change-link-error">{linkError}</div>
                        )}
                        <button
                          className="change-link-btn"
                          onClick={handleChangeLink}
                          disabled={!linkAvailable || !name}
                        >
                          {changeStatus}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* AFFILIATE MODAL */}
        {showModal && (
          <div className="stepper-wrapper">
            <Stepper
              initialStep={1}
              onStepChange={setCurrentStep}
              onFinalStepCompleted={handleAffiliateSignup}
              backButtonText="Previous"
              nextButtonText="Next"
              nextButtonProps={{
                disabled:
                  (currentStep === 2 && name && !linkAvailable) ||
                  (currentStep === 4 && !agreeTos)
              }}
            >
              <Step>
                <h2 className="step-title">Welcome to the Threadly Affiliate program!</h2>
                <p className="step-desc">Follow these steps to join.</p>
              </Step>
              <Step>
                <h2 className="step-title">Create a custom link</h2>
                <input
                  className="step-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your custom link"
                />
                <p className="step-desc">or leave empty to get a random one</p>
                {!linkAvailable && (
                  <div className="step-error">{linkError}</div>
                )}
              </Step>
              <Step>
                <h2 className="step-title">Email Reports</h2>
                <label className="step-checkbox-label">
                  <input
                    type="checkbox"
                    className="step-checkbox"
                    checked={agreeEmail}
                    onChange={e => setAgreeEmail(e.target.checked)}
                  />
                  I agree to receive reports via email.
                </label>
              </Step>
              <Step>
                <h2 className="step-title">Affiliate Terms of Service</h2>
                <label className="step-checkbox-label">
                  <input
                    type="checkbox"
                    className="step-checkbox"
                    checked={agreeTos}
                    onChange={e => setAgreeTos(e.target.checked)}
                  />
                  I agree to the <a className='affiliate-tos-link' href="/affiliate-terms" target="_blank" rel="noopener noreferrer">Affiliate Terms of Service</a>
                </label>
              </Step>
              <Step>
                <h2 className="step-title">Final Step</h2>
                <p className="step-desc">You're all set! Click "Complete" to finish your application.</p>
              </Step>
            </Stepper>
          </div>
        )}

        {/* PAYOUT MODAL */}
        {showPayoutModal && (
          <div className="payout-modal-overlay">

          </div>
        )}
      </div>
    </div >
  )
}

export default Affiliate;