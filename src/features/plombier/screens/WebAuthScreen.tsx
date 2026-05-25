import React from 'react';
import { LogoSVG } from '../components/LogoSVG';
import { WebSessionUser, Role } from '../utils/webTranslations';

interface WebAuthScreenProps {
  businessName: string;
  currentLang: string;
  nextLanguage: string;
  currentTheme: string;
  setCurrentLang: (lang: any) => void;
  setCurrentTheme: (theme: any) => void;
  t: any;
  showToast: any;
  startWebSession: (user: WebSessionUser, tab: string) => void;
  setBypassAuth: (bypass: boolean) => void;
  setCurrentRole: (role: Role) => void;
  setSessionUser: (user: WebSessionUser | null) => void;
  setActiveTab: (tab: string) => void;
}

export const WebAuthScreen: React.FC<WebAuthScreenProps> = ({
  businessName,
  currentLang,
  nextLanguage,
  currentTheme,
  setCurrentLang,
  setCurrentTheme,
  t,
  showToast,
  startWebSession,
  setBypassAuth,
  setCurrentRole,
  setSessionUser,
  setActiveTab,
}) => {
  const [authTab, setAuthTab] = React.useState<'signin' | 'signup' | 'forgot'>('signin');
  const [signinEmail, setSigninEmail] = React.useState('');
  const [signinPassword, setSigninPassword] = React.useState('');
  const [forgotEmail, setForgotEmail] = React.useState('');
  const [forgotStatusMessage, setForgotStatusMessage] = React.useState<string | null>(null);

  const [signupName, setSignupName] = React.useState('');
  const [signupEmail, setSignupEmail] = React.useState('');
  const [signupPhone, setSignupPhone] = React.useState('');
  const [signupCity, setSignupCity] = React.useState('Tunis');
  const [signupPassword, setSignupPassword] = React.useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = React.useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (signinEmail === 'admin@demo.com' && signinPassword === 'admin123') {
      const adminSession: WebSessionUser = {
        id: 'admin-web-demo',
        name: 'Admin Plombier',
        email: 'admin@demo.com',
        role: 'admin',
        phone: '+216 22 000 111',
        status: 'active',
        addresses: ['Tunis'],
        city: 'Tunis',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      startWebSession(adminSession, 'AdminAccueil');
      showToast(
        t('web.autoText42', {
          defaultValue: currentLang === 'AR' ? 'مرحباً بك حضرة المدير' : "Bienvenue dans votre espace d'administration !",
        }),
        'success',
      );
    } else if (signinEmail === 'user@demo.com' && signinPassword === 'user123') {
      const userSession: WebSessionUser = {
        id: 'user-web-demo',
        name: 'Ahmed Ben Ali',
        email: 'user@demo.com',
        role: 'user',
        phone: '+216 22 456 789',
        status: 'active',
        addresses: ['Ariana'],
        city: 'Ariana',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      startWebSession(userSession, 'Accueil');
      showToast(
        t('web.autoText40', {
          defaultValue: currentLang === 'AR' ? 'مرحباً بك أحمد بن علي' : 'Ravi de vous revoir, Ahmed Ben Ali !',
        }),
        'success',
      );
    } else {
      showToast(
        currentLang === 'AR' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Identifiants invalides',
        'error',
      );
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPassword !== signupConfirmPassword) {
      showToast(
        currentLang === 'AR' ? 'كلمات المرور غير متطابقة' : 'Les mots de passe ne correspondent pas',
        'error',
      );
      return;
    }
    const newUser: WebSessionUser = {
      id: 'user-' + Date.now(),
      name: signupName,
      email: signupEmail,
      role: 'user',
      phone: signupPhone,
      status: 'active',
      addresses: [signupCity],
      city: signupCity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    startWebSession(newUser, 'Accueil');
    showToast(
      currentLang === 'AR' ? 'تم إنشاء الحساب بنجاح' : 'Compte créé avec succès !',
      'success',
    );
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Left panel branding visual presentation (desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-[#0F2942] to-[#0A1724] p-12 flex-col justify-between overflow-hidden border-r border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,#F97316_0%,transparent_50%)] pointer-events-none" />

        <div className="flex items-center gap-3 relative z-10">
          <LogoSVG size={52} />
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-white">{businessName}</span>
            <p className="text-[9px] text-[#F97316] font-extrabold tracking-widest uppercase mt-0.5">
              Plomberie · Climatisation · Gaz · Chauffage
            </p>
          </div>
        </div>

        <div className="my-auto space-y-6 relative z-10 text-left">
          <span className="bg-[#F97316] text-white text-[9px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider leading-none">
            PLATEFORME ARTISANALE & MARKETPLACE
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            Le leader de la plomberie express en Tunisie.
          </h2>
          <p className="text-slate-350 text-sm leading-relaxed font-semibold">
            Bénéficiez de dépannages sanitaires immédiats par des plombiers
            agréés et d'un marketplace premium pour acheter des pièces
            détachées d'occasion révisées et garanties.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6">
            <div>
              <div className="text-2xl font-black text-[#F97316]">24h/24</div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-1">
                Intervention Urgente
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#F97316]">100% testé</div>
              <div className="text-[10px] text-slate-400 font-extrabold uppercase mt-1">
                Garantie Pièces
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-bold relative z-10">
          © 2026 {businessName}. Développé pour les particuliers et professionnels.
        </div>
      </div>

      {/* Right panel login/register panel */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-slate-100 dark:bg-[#080B11] transition-colors duration-300">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative transition-all duration-300">
          {/* Premium Floating Preferences Toolbar */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentLang(nextLanguage)}
              className="min-h-[44px] px-3.5 py-2 rounded-lg border text-[10px] font-black tracking-wider uppercase transition shadow-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {nextLanguage === 'AR' ? 'العربية' : nextLanguage === 'EN' ? 'English' : 'Français'}
            </button>

            <button
              type="button"
              onClick={() => setCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
              className="w-8 h-8 rounded-lg border flex items-center justify-center transition shadow-sm bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              {currentTheme === 'light' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-amber-400">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                </svg>
              )}
            </button>
          </div>

          <div className="text-center pt-2">
            <div className="lg:hidden mx-auto mb-4 flex justify-center">
              <LogoSVG size={56} />
            </div>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white">
              {authTab === 'signin' && tCommon('web.signinTitle', translate('web.autoText31', { defaultValue: currentLang === 'AR' ? 'تسجيل الدخول' : 'Connexion' }))}
              {authTab === 'signup' && tCommon('web.signupTitle', translate('web.autoText32', { defaultValue: currentLang === 'AR' ? 'إنشاء حساب جديد' : 'Inscription' }))}
              {authTab === 'forgot' && (currentLang === 'AR' ? 'نسيت كلمة المرور' : 'Mot de passe oublié')}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 font-semibold">
              {authTab === 'signin' && tCommon('web.signinSubtitle', translate('web.autoText33', { defaultValue: currentLang === 'AR' ? 'سجل دخولك للوصول إلى حسابك الفاخر' : 'Connectez-vous pour accéder à votre espace premium.' }))}
              {authTab === 'signup' && tCommon('web.signupSubtitle', translate('web.autoText34', { defaultValue: currentLang === 'AR' ? 'قم بإنشاء حسابك المجاني في ثوانٍ معدودة' : 'Créez votre compte client gratuit en quelques secondes.' }))}
              {authTab === 'forgot' && (currentLang === 'AR' ? 'أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور.' : 'Entrez votre email pour recevoir les instructions de réinitialisation.')}
            </p>
          </div>

          {authTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.emailLabel', translate('web.autoText35', { defaultValue: currentLang === 'AR' ? 'البريد الإلكتروني' : 'Adresse Email' }))}
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemple@email.com"
                  value={signinEmail}
                  onChange={e => setSigninEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.passwordLabel', translate('web.autoText36', { defaultValue: currentLang === 'AR' ? 'كلمة المرور' : 'Mot de Passe' }))}
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={signinPassword}
                  onChange={e => setSigninPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                />
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('forgot');
                    setForgotEmail(signinEmail);
                    setForgotStatusMessage(null);
                  }}
                  className="text-[#F97316] hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  {currentLang === 'AR' ? 'هل نسيت كلمة المرور؟' : 'Forgot Password?'}
                </button>
                <span className="text-[10px]">{currentLang === 'AR' ? 'تسجيل آمن' : 'Secure login'}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
              >
                {tCommon('web.secureLoginButton', translate('web.autoText37', { defaultValue: currentLang === 'AR' ? 'دخول آمن' : 'Connexion Sécurisée' }))}
              </button>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-bold mb-2.5">
                  {tCommon('web.demoAccountsLabel', translate('web.autoText38', { defaultValue: currentLang === 'AR' ? 'حسابات التجربة الفورية' : 'COMPTES DE DÉMO DE PLOMBERIE (ACCÈS DIRECT)' }))}
                </p>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSigninEmail('user@demo.com');
                      setSigninPassword('user123');
                      showToast(tCommon('web.signingIn', translate('web.autoText39', { defaultValue: currentLang === 'AR' ? 'جاري تسجيل الدخول...' : 'Connexion en cours...' })), 'info');
                      setTimeout(() => {
                        const userSession: WebSessionUser = {
                          id: 'user-web-demo',
                          name: 'Ahmed Ben Ali',
                          email: 'user@demo.com',
                          role: 'user',
                          phone: '+216 22 456 789',
                          status: 'active',
                          addresses: ['Ariana'],
                          city: 'Ariana',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        startWebSession(userSession, 'Accueil');
                        showToast(translate('web.autoText40', { defaultValue: currentLang === 'AR' ? 'مرحباً بك أحمد بن علي' : 'Ravi de vous revoir, Ahmed Ben Ali !' }), 'success');
                      }, 250);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                  >
                    Client (Ahmed Ben Ali)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSigninEmail('admin@demo.com');
                      setSigninPassword('admin123');
                      showToast(tCommon('web.signingIn', translate('web.autoText41', { defaultValue: currentLang === 'AR' ? 'جاري تسجيل الدخول...' : 'Connexion en cours...' })), 'info');
                      setTimeout(() => {
                        const adminSession: WebSessionUser = {
                          id: 'admin-web-demo',
                          name: 'Admin Plombier',
                          email: 'admin@demo.com',
                          role: 'admin',
                          phone: '+216 22 000 111',
                          status: 'active',
                          addresses: ['Tunis'],
                          city: 'Tunis',
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        startWebSession(adminSession, 'AdminAccueil');
                        showToast(translate('web.autoText42', { defaultValue: currentLang === 'AR' ? 'مرحباً بك حضرة المدير' : "Bienvenue dans votre espace d'administration !" }), 'success');
                      }, 250);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-250 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-black py-2.5 rounded-lg transition"
                  >
                    Admin Plombier
                  </button>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {translate('web.autoText43', { defaultValue: currentLang === 'AR' ? 'ليس لديك حساب؟' : `Nouveau sur ${businessName} ?` })}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signup');
                      setSigninEmail('');
                      setSigninPassword('');
                    }}
                    className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    {translate('web.autoText44', { defaultValue: currentLang === 'AR' ? 'أنشئ حساباً جديداً' : 'Créer un compte' })}
                  </button>
                </p>
              </div>
            </form>
          )}

          {authTab === 'forgot' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setForgotStatusMessage(
                  currentLang === 'AR'
                    ? 'تم إرسال رابط إعادة تعيين كلمة المرور بنجاح !'
                    : 'Le lien de réinitialisation a été envoyé !'
                );
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {tCommon('web.emailLabel', translate('web.autoText35', { defaultValue: currentLang === 'AR' ? 'البريد الإلكتروني' : 'Adresse Email' }))}
                </label>
                <input
                  type="email"
                  required
                  placeholder="exemple@email.com"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] text-left transition-colors"
                />
              </div>

              {forgotStatusMessage && (
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {forgotStatusMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
              >
                {currentLang === 'AR' ? 'إرسال رابط إعادة التعيين' : 'Send reset link'}
              </button>

              <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signin');
                    setForgotStatusMessage(null);
                  }}
                  className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  {currentLang === 'AR' ? 'العودة إلى تسجيل الدخول' : 'Back to sign in'}
                </button>
              </div>
            </form>
          )}

          {authTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {translate('web.autoText45', { defaultValue: currentLang === 'AR' ? 'الاسم الكامل' : 'Nom Complet' })}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ahmed Ben Salem"
                  value={signupName}
                  onChange={e => setSignupName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {translate('web.autoText46', { defaultValue: currentLang === 'AR' ? 'البريد الإلكتروني' : 'Email' })}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nom@email.tn"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {translate('web.autoText47', { defaultValue: currentLang === 'AR' ? 'الهاتف' : 'Téléphone' })}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+216 22 111 222"
                    value={signupPhone}
                    onChange={e => setSignupPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                  {translate('web.autoText48', { defaultValue: currentLang === 'AR' ? 'المدينة / الولاية' : 'Ville / Gouvernorat' })}
                </label>
                <select
                  value={signupCity}
                  onChange={e => setSignupCity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none transition-colors"
                >
                  <option value="Tunis">Tunis</option>
                  <option value="Ariana">Ariana</option>
                  <option value="Ben Arous">Ben Arous</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Monastir">Monastir</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {translate('web.autoText49', { defaultValue: currentLang === 'AR' ? 'كلمة المرور' : 'Mot de Passe' })}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-left">
                    {translate('web.autoText50', { defaultValue: currentLang === 'AR' ? 'تأكيد كلمة المرور' : 'Confirmation' })}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={e => setSignupConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-650 focus:outline-none focus:border-[#F97316] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-3.5 rounded-xl transition shadow-lg uppercase tracking-wider hover:scale-[1.01] transform"
              >
                {translate('web.autoText51', { defaultValue: currentLang === 'AR' ? 'إنشاء حساب جديد' : 'Créer mon compte client' })}
              </button>

              <div className="text-center pt-3 border-t border-slate-200 dark:border-slate-850">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {translate('web.autoText52', { defaultValue: currentLang === 'AR' ? 'لديك حساب بالفعل؟' : 'Déjà inscrit ?' })}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('signin');
                      setSignupName('');
                      setSignupEmail('');
                      setSignupPhone('');
                      setSignupPassword('');
                      setSignupConfirmPassword('');
                    }}
                    className="text-[#F97316] font-extrabold hover:underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    {translate('web.autoText53', { defaultValue: currentLang === 'AR' ? 'تسجيل الدخول' : 'Se connecter' })}
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* BYPASS AUTH / CONTINUE AS GUEST */}
          <div className="border-t border-slate-200 dark:border-slate-850 pt-5 text-center flex flex-col gap-3">
            <button
              onClick={() => {
                setBypassAuth(true);
                setCurrentRole('anonyme');
                setSessionUser(null);
                setActiveTab('Accueil');
                showToast(
                  translate('web.autoText54', {
                    defaultValue: currentLang === 'AR' ? 'تصفح بصفتك زائر' : 'Accès Invité autorisé.',
                  }),
                  'info',
                );
              }}
              className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-300 dark:border-slate-850 text-slate-650 hover:text-slate-800 dark:text-slate-350 dark:hover:text-white text-xs font-black py-3.5 rounded-xl transition flex items-center justify-center gap-2 hover:scale-[1.01] transform"
            >
              <span>
                {translate('web.autoText55', {
                  defaultValue: currentLang === 'AR' ? 'المواصلة كزائر (مجهول) ←' : "Continuer en tant qu'invité (Anonyme) →",
                })}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
