import React from 'react';

const About = () => {
    return (
        <div className="fade-in" style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                <span style={{ display: 'inline-block', background: 'var(--primary-gradient)', color: 'white', fontWeight: '600', letterSpacing: '1px', fontSize: '13px', textTransform: 'uppercase', padding: '6px 16px', borderRadius: '100px', marginBottom: '16px' }}>
                    Notre Histoire
                </span>
                <h1 style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 24px 0', letterSpacing: '-1px' }}>
                    À propos de <span style={{ color: '#3b82f6' }}>DIYAMGAZ</span>
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                    Votre partenaire de confiance pour la livraison rapide et sécurisée de gaz butane et d'eau minérale au Sénégal.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                <div className="bento-card fade-up">
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Notre Mission</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '15px' }}>
                        Simplifier le quotidien des ménages sénégalais en leur offrant un service de livraison express, fiable et professionnel. Nous voulons que l'accès au gaz et à l'eau potable ne soit plus jamais une corvée, mais une expérience fluide.
                    </p>
                </div>
                <div className="bento-card fade-up" style={{ animationDelay: '0.1s' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Notre Vison</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '15px' }}>
                        Devenir le leader incontesté de la distribution de première nécessité à domicile en Afrique de l'Ouest, en innovant constamment avec les technologies numériques pour optimiser notre chaîne logistique.
                    </p>
                </div>
                <div className="bento-card fade-up" style={{ animationDelay: '0.2s' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: 'var(--text-main)' }}>Nos Valeurs</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '15px' }}>
                        <strong>Sécurité :</strong> Manipulation conforme aux normes.<br />
                        <strong>Rapidité :</strong> Un réseau de livreurs optimisé.<br />
                        <strong>Proximité :</strong> Un service client humain, directement sur WhatsApp ou par téléphone.
                    </p>
                </div>
            </div>

            {/* Section Images Propos */}
            <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '60px', animationDelay: '0.3s' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', height: '250px', background: 'var(--bg-secondary)', boxShadow: 'var(--bento-shadow)' }}>
                    <img src="/propos.png" alt="Équipe DIYAMGAZ 1" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s hover:scale-105' }} />
                </div>
                <div style={{ borderRadius: '16px', overflow: 'hidden', height: '250px', background: 'var(--bg-secondary)', boxShadow: 'var(--bento-shadow)' }}>
                    <img src="/propos2.png" alt="Équipe DIYAMGAZ 2" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s hover:scale-105' }} />
                </div>
                <div style={{ borderRadius: '16px', overflow: 'hidden', height: '250px', background: 'var(--bg-secondary)', boxShadow: 'var(--bento-shadow)' }}>
                    <img src="/propos3.png" alt="Équipe DIYAMGAZ 3" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s hover:scale-105' }} />
                </div>
            </div>

            <div className="bento-card fade-up" style={{ padding: '60px 40px', textAlign: 'center', background: 'var(--bg-secondary)', animationDelay: '0.3s' }}>
                <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: 'var(--text-main)' }}>Prêt à commander ?</h2>
                <p style={{ fontSize: '16px', color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                    Rejoignez des milliers de clients satisfaits. Passez votre commande en quelques clics ou contactez-nous directement !
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <a href="/" style={{ padding: '16px 32px', borderRadius: '12px', background: 'var(--text-main)', color: 'white', textDecoration: 'none', fontWeight: '600', transition: 'var(--transition-fast)' }}>
                        Voir le catalogue
                    </a>
                    <a href="https://wa.me/221711425492" target="_blank" rel="noopener noreferrer" style={{ padding: '16px 32px', borderRadius: '12px', background: '#25D366', color: 'white', textDecoration: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'var(--transition-fast)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        Nous contacter
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;
