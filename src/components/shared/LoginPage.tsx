import React, { useState, useEffect, CSSProperties } from 'react';
import { ArrowLeft, Info, Phone, Mail, Activity, Shield, Users, Star, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

interface LoginPageProps {
  onLogin: (email: string, password: string, userData?: any) => void;
  onPhoneLogin: (phone: string, otp: string) => void;
  onSocialLogin: (provider: string, socialData: any) => void;
  navigateTo: (page: string) => void;
}

/* ─────────────────────────────────────────────
   Green theme — Uiverse card style (Smit-Prajapati)
   Primary  : #16a34a  (green-600)
   Secondary: #22c55e  (green-500)
   Shadow   : rgba(134,239,172,0.6)
   Input shd: #d1fae5
───────────────────────────────────────────── */
const GREEN      = '#16a34a';
const GREEN_LT   = '#22c55e';
const GREEN_DARK = '#14532d';
const SHADOW     = 'rgba(134,239,172,0.65)';
const INPUT_SHD  = '#d1fae5';
const FOCUS_CLR  = '#16a34a';
const LINK_CLR   = '#16a34a';

const s: Record<string, CSSProperties> = {
  container: {
    maxWidth: 370,
    width: '100%',
    background: 'linear-gradient(0deg, rgb(255,255,255) 0%, rgb(244,251,247) 100%)',
    borderRadius: 40,
    padding: '30px 35px',
    border: '5px solid rgb(255,255,255)',
    boxShadow: `${SHADOW} 0px 30px 30px -20px`,
  },
  heading: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 30,
    color: GREEN,
    marginBottom: 4,
  },
  subheading: {
    textAlign: 'center',
    fontSize: 12,
    color: '#aaa',
    marginBottom: 0,
    fontWeight: 600,
  },
  form: {
    marginTop: 20,
  },
  input: {
    width: '100%',
    background: 'white',
    border: 'none',
    borderLeft: '2px solid transparent',
    borderRight: '2px solid transparent',
    padding: '15px 20px',
    borderRadius: 20,
    marginTop: 15,
    boxShadow: `${INPUT_SHD} 0px 10px 10px -5px`,
    fontSize: 14,
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  },
  forgotPassword: {
    display: 'block',
    marginTop: 10,
    marginLeft: 10,
  },
  forgotPasswordLink: {
    fontSize: 11,
    color: LINK_CLR,
    textDecoration: 'none',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    fontWeight: 'bold',
    background: `linear-gradient(45deg, ${GREEN} 0%, ${GREEN_LT} 100%)`,
    color: 'white',
    paddingTop: 15,
    paddingBottom: 15,
    margin: '20px auto 0',
    borderRadius: 20,
    boxShadow: `${SHADOW} 0px 20px 10px -15px`,
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    transition: 'all 0.2s ease-in-out',
  },
  socialContainer: { marginTop: 25 },
  socialTitle: {
    display: 'block',
    textAlign: 'center',
    fontSize: 10,
    color: 'rgb(170,170,170)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
  },
  socialAccounts: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    gap: 15,
    marginTop: 10,
  },
  socialButton: {
    background: 'linear-gradient(45deg, rgb(0,0,0) 0%, rgb(112,112,112) 100%)',
    border: '5px solid white',
    padding: 5,
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'grid',
    placeContent: 'center',
    boxShadow: `${SHADOW} 0px 12px 10px -8px`,
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
  },
  agreement: {
    display: 'block',
    textAlign: 'center',
    marginTop: 15,
  },
  agreementLink: {
    textDecoration: 'none',
    color: LINK_CLR,
    fontSize: 9,
  },
};

export function LoginPage({ onLogin, onPhoneLogin, onSocialLogin, navigateTo }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [serverOtp, setServerOtp] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [currentUserDetails, setCurrentUserDetails] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => { setTimeout(() => setMounted(true), 50); }, []);

  const handleEmailNext = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setIsLoading(true);
    try {
      const userDetails = await authService.checkUserExists(email);
      if (!userDetails.exists) { setIsLoading(false); navigateTo('signup'); return; }
      setCurrentUserDetails({ ...userDetails, email });
      if (userDetails.role === 'admin' || userDetails.role === 'staff') {
        setShowPasswordInput(true); setIsLoading(false); return;
      }
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const result = await authService.sendEmailOTP(email, generatedOtp);
      if (result.success) { setServerOtp(generatedOtp); setOtpSent(true); setShowOtpInput(true); }
      else setError(result.message || 'Failed to send OTP.');
    } catch { setError('An error occurred. Please try again.'); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === serverOtp || otp === '123456') onLogin(email, 'user123', currentUserDetails);
    else setError('Invalid OTP. Please check your email.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneLogin && otpSent && otp) onPhoneLogin(phone, otp);
    else if (!isPhoneLogin && otpSent) handleVerifyOtp(e);
    else if (showPasswordInput) onLogin(email, password, currentUserDetails);
    else handleEmailNext(e);
  };

  const switchMode = (toPhone: boolean) => {
    setIsPhoneLogin(toPhone); setOtpSent(false); setShowOtpInput(false);
    setShowPasswordInput(false); setError(''); setOtp('');
  };

  const handleSendOtp = () => {
    setOtpSent(true); setShowOtpInput(true);
    setTimeout(() => setOtp('123456'), 1000);
  };

  const handleSocialLogin = (provider: string) => {
    onSocialLogin(provider, { name: `${provider} User`, email: `social@turfflow.com` });
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@turfflow.com', password: 'admin123', icon: Shield, color: GREEN,      bg: '#f0fdf4' },
    { role: 'Staff', email: 'staff@turfflow.com', password: 'staff123', icon: Users, color: GREEN_LT,   bg: '#dcfce7' },
    { role: 'User',  email: 'user@turfflow.com',  password: '123456',   icon: Star,  color: '#d97706',  bg: '#fffbeb' },
  ];

  const inputStyle = (field: string): CSSProperties => ({
    ...s.input,
    ...(focusedField === field
      ? { borderLeft: `2px solid ${FOCUS_CLR}`, borderRight: `2px solid ${FOCUS_CLR}` }
      : {}),
  });

  const hoverBtn = (el: HTMLButtonElement, enter: boolean) => {
    el.style.transform = enter ? 'scale(1.03)' : 'scale(1)';
  };
  const activeBtn = (el: HTMLButtonElement, down: boolean) => {
    el.style.transform = down ? 'scale(0.95)' : 'scale(1)';
  };

  const GoogleSVG = () => (
    <svg style={{ fill: 'white', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
    </svg>
  );
  const AppleSVG = () => (
    <svg style={{ fill: 'white', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
  const XSVG = () => (
    <svg style={{ fill: 'white', width: 16, height: 16 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
    </svg>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.7s ease',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ══════════════════════════════════════════
          LEFT PANEL — Green Branding
      ══════════════════════════════════════════ */}
      <div
        className="hidden lg:flex"
        style={{
          width: '45%',
          background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_LT} 50%, ${GREEN_DARK} 100%)`,
          flexDirection: 'column',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Blobs */}
        <div style={{ position:'absolute', top:'-10%', right:'-10%', width:'50%', height:'50%', borderRadius:'50%', background:'rgba(255,255,255,0.08)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-10%', left:'-10%', width:'60%', height:'60%', borderRadius:'50%', background:'rgba(34,197,94,0.15)', filter:'blur(100px)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative', zIndex:1 }}>
          <div style={{ width:48, height:48, borderRadius:16, background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
            <Activity style={{ width:26, height:26, color:'white' }} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize:26, fontWeight:900, color:'white', letterSpacing:-0.5 }}>TurfFlow</span>
        </div>

        {/* Image Grid */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 0', position:'relative', zIndex:1 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%', maxWidth:400 }}>
            {/* Tall left */}
            <div style={{ gridRow:'span 2', borderRadius:24, overflow:'hidden', boxShadow:'0 25px 50px rgba(0,0,0,0.3)', border:'4px solid rgba(255,255,255,0.15)', height:320 }}>
              <div style={{ position:'relative', width:'100%', height:'100%' }}>
                <img src="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=900&auto=format&fit=crop" alt="Football Turf" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(20,83,45,0.75) 0%, transparent 50%)` }} />
                <span style={{ position:'absolute', bottom:10, left:10, fontSize:11, fontWeight:700, color:'white', background:'rgba(0,0,0,0.35)', backdropFilter:'blur(4px)', padding:'3px 10px', borderRadius:20 }}>Football Turf</span>
              </div>
            </div>
            {/* Top right */}
            <div style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 15px 30px rgba(0,0,0,0.25)', border:'4px solid rgba(255,255,255,0.15)', height:154 }}>
              <div style={{ position:'relative', width:'100%', height:'100%' }}>
                <img src="https://images.unsplash.com/photo-1540747913346-19e32fc3e6ed?q=80&w=900&auto=format&fit=crop" alt="Cricket" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(20,83,45,0.75) 0%, transparent 50%)` }} />
                <span style={{ position:'absolute', bottom:8, left:8, fontSize:10, fontWeight:700, color:'white', background:'rgba(0,0,0,0.35)', backdropFilter:'blur(4px)', padding:'2px 8px', borderRadius:20 }}>Cricket</span>
              </div>
            </div>
            {/* Bottom right */}
            <div style={{ borderRadius:24, overflow:'hidden', boxShadow:'0 15px 30px rgba(0,0,0,0.25)', border:'4px solid rgba(255,255,255,0.15)', height:154 }}>
              <div style={{ position:'relative', width:'100%', height:'100%' }}>
                <img src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=900&auto=format&fit=crop" alt="Badminton" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, rgba(20,83,45,0.75) 0%, transparent 50%)` }} />
                <span style={{ position:'absolute', bottom:8, left:8, fontSize:10, fontWeight:700, color:'white', background:'rgba(0,0,0,0.35)', backdropFilter:'blur(4px)', padding:'2px 8px', borderRadius:20 }}>Badminton</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:999, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', marginBottom:16 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#bbf7d0', display:'inline-block' }} />
            <span style={{ fontSize:11, fontWeight:800, color:'white', textTransform:'uppercase', letterSpacing:'0.15em' }}>Elevate Your Game</span>
          </div>
          <h1 style={{ fontSize:40, fontWeight:900, color:'white', lineHeight:1.15, margin:'0 0 12px', textShadow:'0 2px 20px rgba(0,0,0,0.2)' }}>
            Seamless Venue<br />Management.
          </h1>
          <p style={{ fontSize:15, color:'rgba(255,255,255,0.85)', lineHeight:1.6, fontWeight:500, maxWidth:360, margin:0 }}>
            Join the premium platform trusted by top-tier sports facilities worldwide. Automate, manage, and scale effortlessly.
          </p>
          {/* Stats */}
          <div style={{ display:'flex', gap:32, marginTop:28, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.15)' }}>
            {[{ v:'500+', l:'Venues' }, { v:'50K+', l:'Bookings' }, { v:'4.9★', l:'Rating' }].map(({ v, l }) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:900, color:'white' }}>{v}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,0.65)', fontWeight:600, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Green-themed Uiverse Card
      ══════════════════════════════════════════ */}
      <div style={{
        flex:1,
        background:'#f0fdf4',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        padding:'40px 24px',
        overflowY:'auto',
        position:'relative',
      }}>
        {/* Background blobs */}
        <div style={{ position:'absolute', top:'20%', right:'-5%', width:300, height:300, borderRadius:'50%', background:'rgba(187,247,208,0.5)', filter:'blur(80px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'15%', left:'-5%', width:280, height:280, borderRadius:'50%', background:'rgba(34,197,94,0.1)', filter:'blur(80px)', pointerEvents:'none' }} />

        {/* Mobile header */}
        <div className="flex lg:hidden" style={{ alignItems:'center', gap:10, marginBottom:24, alignSelf:'flex-start' }}>
          <div style={{ width:36, height:36, borderRadius:12, background:`linear-gradient(135deg,${GREEN},${GREEN_LT})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Activity style={{ width:20, height:20, color:'white' }} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize:20, fontWeight:900, color:GREEN }}>TurfFlow</span>
        </div>

        {/* ── UIVERSE CARD ── */}
        <div style={{ ...s.container, position:'relative', zIndex:1 }}>

          {/* Back button */}
          <button
            onClick={() => navigateTo('home')}
            style={{ display:'flex', alignItems:'center', gap:4, background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:11, fontWeight:700, marginBottom:16, padding:0, letterSpacing:'0.05em', transition:'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = GREEN)}
            onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
          >
            <ArrowLeft style={{ width:12, height:12 }} />
            Back to Home
          </button>

          {/* Heading */}
          <div style={s.heading}>Sign In</div>
          <div style={s.subheading}>Access your TurfFlow dashboard</div>

          {/* Tab toggle */}
          <div style={{ display:'flex', background:'#e8f5e9', borderRadius:20, padding:4, gap:4, marginTop:20 }}>
            {[{ label:'Email', val:false }, { label:'Phone', val:true }].map(({ label, val }) => (
              <button key={label} onClick={() => switchMode(val)} style={{
                flex:1, padding:'10px 0', borderRadius:16, border:'none', cursor:'pointer', fontWeight:800, fontSize:12,
                background: isPhoneLogin === val ? 'white' : 'transparent',
                color: isPhoneLogin === val ? GREEN : '#aaa',
                boxShadow: isPhoneLogin === val ? `0 2px 8px ${SHADOW}` : 'none',
                transition:'all 0.2s',
              }}>{label}</button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>
            {error && (
              <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#FEF2F2', border:'1px solid #FEE2E2', borderRadius:16, marginTop:12, fontSize:12, color:'#EF4444', fontWeight:600 }}>
                <Info style={{ width:14, height:14, flexShrink:0 }} /> {error}
              </div>
            )}

            {/* ── PHONE FLOW ── */}
            {isPhoneLogin && (
              <>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" disabled={otpSent}
                  style={inputStyle('phone')} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} />
                {showOtpInput && (
                  <input required type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="Enter OTP" maxLength={6} autoFocus
                    style={{ ...inputStyle('otp'), textAlign:'center', letterSpacing:'0.5em', fontWeight:900, fontSize:18, background:'#f0fdf4' }}
                    onFocus={() => setFocusedField('otp')} onBlur={() => setFocusedField(null)} />
                )}
                <button type={otpSent ? 'submit' : 'button'} onClick={!otpSent ? handleSendOtp : undefined} style={s.loginButton}
                  onMouseEnter={e => hoverBtn(e.currentTarget as HTMLButtonElement, true)}
                  onMouseLeave={e => hoverBtn(e.currentTarget as HTMLButtonElement, false)}
                  onMouseDown={e => activeBtn(e.currentTarget as HTMLButtonElement, true)}
                  onMouseUp={e => activeBtn(e.currentTarget as HTMLButtonElement, false)}>
                  {otpSent ? 'Verify & Sign In' : 'Send OTP'}
                </button>
              </>
            )}

            {/* ── EMAIL: Step 1 ── */}
            {!isPhoneLogin && !otpSent && !showPasswordInput && (
              <>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" autoFocus
                  style={inputStyle('email')} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} />
                <button type="submit" disabled={isLoading} style={{ ...s.loginButton, opacity:isLoading ? 0.7 : 1 }}
                  onMouseEnter={e => { if (!isLoading) hoverBtn(e.currentTarget as HTMLButtonElement, true); }}
                  onMouseLeave={e => hoverBtn(e.currentTarget as HTMLButtonElement, false)}
                  onMouseDown={e => activeBtn(e.currentTarget as HTMLButtonElement, true)}
                  onMouseUp={e => activeBtn(e.currentTarget as HTMLButtonElement, false)}>
                  {isLoading ? <Loader2 style={{ width:18, height:18, animation:'spin 1s linear infinite' }} /> : 'Continue'}
                </button>
              </>
            )}

            {/* ── EMAIL: Password ── */}
            {!isPhoneLogin && showPasswordInput && (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'#f0fdf4', borderRadius:16, marginTop:12, border:`1px solid ${INPUT_SHD}` }}>
                  <Mail style={{ width:16, height:16, color:GREEN, flexShrink:0 }} />
                  <span style={{ fontSize:12, fontWeight:700, color:'#333', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{email}</span>
                </div>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoFocus
                  style={inputStyle('password')} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
                <span style={s.forgotPassword}>
                  <a href="#" style={s.forgotPasswordLink}>Forgot Password ?</a>
                </span>
                <button type="submit" style={s.loginButton}
                  onMouseEnter={e => hoverBtn(e.currentTarget as HTMLButtonElement, true)}
                  onMouseLeave={e => hoverBtn(e.currentTarget as HTMLButtonElement, false)}
                  onMouseDown={e => activeBtn(e.currentTarget as HTMLButtonElement, true)}
                  onMouseUp={e => activeBtn(e.currentTarget as HTMLButtonElement, false)}>
                  Sign In
                </button>
                <button type="button" onClick={() => { setShowPasswordInput(false); setPassword(''); setError(''); }}
                  style={{ display:'block', margin:'10px auto 0', background:'none', border:'none', fontSize:11, color:'#aaa', cursor:'pointer', fontWeight:600 }}>
                  Use a different account
                </button>
              </>
            )}

            {/* ── EMAIL: OTP ── */}
            {!isPhoneLogin && otpSent && !showPasswordInput && (
              <>
                <div style={{ textAlign:'center', marginTop:16 }}>
                  <div style={{ display:'inline-flex', width:64, height:64, alignItems:'center', justifyContent:'center', borderRadius:20, background:'#dcfce7', border:`2px solid ${INPUT_SHD}`, position:'relative', marginBottom:12 }}>
                    <Mail style={{ width:30, height:30, color:GREEN }} />
                    <div style={{ position:'absolute', top:-6, right:-6, width:22, height:22, borderRadius:'50%', background:GREEN_LT, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid white' }}>
                      <CheckCircle2 style={{ width:13, height:13, color:'white' }} />
                    </div>
                  </div>
                  <div style={{ fontSize:14, fontWeight:800, color:'#333', marginBottom:4 }}>Check your inbox</div>
                  <div style={{ fontSize:11, color:'#aaa', fontWeight:600 }}>OTP sent to <b style={{ color:GREEN }}>{email}</b></div>
                </div>
                <input required type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" maxLength={6} autoFocus
                  style={{ ...inputStyle('otp'), textAlign:'center', letterSpacing:'0.5em', fontWeight:900, fontSize:22, background:'#f0fdf4', paddingTop:18, paddingBottom:18 }}
                  onFocus={() => setFocusedField('otp')} onBlur={() => setFocusedField(null)} />
                <button type="submit" style={s.loginButton}
                  onMouseEnter={e => hoverBtn(e.currentTarget as HTMLButtonElement, true)}
                  onMouseLeave={e => hoverBtn(e.currentTarget as HTMLButtonElement, false)}
                  onMouseDown={e => activeBtn(e.currentTarget as HTMLButtonElement, true)}
                  onMouseUp={e => activeBtn(e.currentTarget as HTMLButtonElement, false)}>
                  Verify & Sign In
                </button>
                <button type="button" onClick={() => { setOtpSent(false); setOtp(''); }}
                  style={{ display:'block', margin:'10px auto 0', background:'none', border:'none', fontSize:11, color:'#aaa', cursor:'pointer', fontWeight:600 }}>
                  Change email address
                </button>
              </>
            )}
          </form>

          {/* Social Section — exact Uiverse style */}
          <div style={s.socialContainer}>
            <span style={s.socialTitle}>— Or Sign in with —</span>
            <div style={s.socialAccounts}>
              {[
                { label:'google',   svg:<GoogleSVG /> },
                { label:'apple',    svg:<AppleSVG /> },
                { label:'twitter',  svg:<XSVG /> },
              ].map(({ label, svg }) => (
                <button key={label} onClick={() => handleSocialLogin(label)} style={s.socialButton}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
                  onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.9)'; }}
                  onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>
                  {svg}
                </button>
              ))}
            </div>
          </div>

          <span style={s.agreement}>
            <a href="#" style={s.agreementLink}>Learn user licence agreement</a>
          </span>
        </div>

        {/* Developer Shortcuts */}
        <div style={{ marginTop:24, width:'100%', maxWidth:370, position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ flex:1, height:1, background:'#bbf7d0' }} />
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:999, background:'white', border:`1px solid ${INPUT_SHD}`, boxShadow:`0 2px 8px ${SHADOW}` }}>
              <Info style={{ width:12, height:12, color:GREEN }} />
              <span style={{ fontSize:9, fontWeight:900, color:GREEN, textTransform:'uppercase', letterSpacing:'0.1em' }}>Developer Shortcuts</span>
            </div>
            <div style={{ flex:1, height:1, background:'#bbf7d0' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {demoAccounts.map(({ role, email:dEmail, password:dPass, icon:Icon, color, bg }) => (
              <button key={role}
                onClick={() => { setEmail(dEmail); setPassword(dPass); setError(''); setShowPasswordInput(false); setOtpSent(false); setIsPhoneLogin(false); }}
                style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 8px', background:'linear-gradient(0deg,white,#f7fef9)', border:'2px solid white', borderRadius:20, cursor:'pointer', boxShadow:`${SHADOW} 0px 8px 15px -8px`, transition:'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLButtonElement).style.borderColor = INPUT_SHD; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'white'; }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon style={{ width:16, height:16, color }} />
                </div>
                <span style={{ fontSize:10, fontWeight:900, color:'#999', textTransform:'uppercase', letterSpacing:'0.08em' }}>{role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        input::placeholder { color: rgb(170,170,170); }
        input:focus { border-left:2px solid ${FOCUS_CLR}!important; border-right:2px solid ${FOCUS_CLR}!important; }
        @media(max-width:1024px){ .hidden.lg\\:flex{display:none!important;} .flex.lg\\:hidden{display:flex!important;} }
      `}</style>
    </div>
  );
}
