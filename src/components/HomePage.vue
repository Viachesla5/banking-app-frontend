<template>
  <div class="homepage-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <i class="fas fa-university me-3"></i>
            Welcome to InhollandBank
          </h1>
          <p class="hero-subtitle">Your trusted partner for modern banking solutions</p>
          <p class="hero-description">
            Experience secure, convenient, and reliable banking services designed for the digital age. 
            Manage your finances with confidence through our cutting-edge platform.
          </p>
          <div class="hero-buttons">
            <router-link to="/register" class="btn btn-primary btn-lg me-3">
              <i class="fas fa-user-plus me-2"></i>
              Get Started
            </router-link>
            <router-link to="/login" class="btn btn-outline-light btn-lg">
              <i class="fas fa-sign-in-alt me-2"></i>
              Sign In
            </router-link>
          </div>
        </div>
        <div class="hero-features">
          <div class="feature-card">
            <i class="fas fa-shield-alt"></i>
            <h3>Bank-Grade Security</h3>
            <p>256-bit SSL encryption protects all your transactions</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-mobile-alt"></i>
            <h3>24/7 Access</h3>
            <p>Access your accounts anytime, anywhere</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-headset"></i>
            <h3>Expert Support</h3>
            <p>Dedicated customer service team</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Us Section -->
    <section class="about-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">About InhollandBank</h2>
          <p class="section-subtitle">Building trust through innovation and security</p>
        </div>
        
        <div class="about-content">
          <div class="about-text">
            <div class="about-card">
              <h3><i class="fas fa-history me-2"></i>Our Story</h3>
              <p>
                Founded in 2025, InhollandBank was started by two IT students who were retaking Code Generation 2.4 Project. 
                What began as a school project evolved into a revolutionary digital banking platform. 
                We combine fresh perspectives from the next generation with cutting-edge technology to provide exceptional 
                financial services to students, professionals, and businesses across the Netherlands.
              </p>
            </div>
            
            <div class="about-card">
              <h3><i class="fas fa-target me-2"></i>Our Mission</h3>
              <p>
                To democratize banking by making financial services accessible, secure, and user-friendly 
                for everyone, especially students and young professionals. We believe that banking should be simple, 
                transparent, and always available when you need it most.
              </p>
            </div>
            
            <div class="about-card">
              <h3><i class="fas fa-certificate me-2"></i>Licensed & Regulated</h3>
              <p>
                InhollandBank is fully licensed and regulated by De Nederlandsche Bank (DNB) and operates 
                under strict European banking regulations. Your deposits are protected by the Dutch 
                Deposit Guarantee Scheme up to €100,000.
              </p>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">50K+</div>
              <div class="stat-label">Happy Customers</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">€2.5B</div>
              <div class="stat-label">Assets Under Management</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">Uptime Guarantee</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">24/7</div>
              <div class="stat-label">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Get In Touch</h2>
          <p class="section-subtitle">We're here to help with all your banking needs</p>
        </div>
        
        <div class="contact-content">
          <div class="contact-methods">
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-phone"></i>
              </div>
              <h3>Phone Support</h3>
              <p class="contact-detail">+31 20 123 4567</p>
              <p class="contact-hours">Monday - Friday: 8:00 - 20:00<br>Weekend: 9:00 - 17:00</p>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <h3>Email Support</h3>
              <p class="contact-detail">support@inhollandbank.nl</p>
              <p class="contact-hours">Response within 24 hours<br>Priority support for urgent issues</p>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <h3>Visit Our Office</h3>
              <p class="contact-detail">
                Bijdorplaan 15<br>
                2015 CE Haarlem<br>
                Netherlands
              </p>
              <p class="contact-hours">By appointment only</p>
            </div>
            
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-comments"></i>
              </div>
              <h3>Live Chat</h3>
              <p class="contact-detail">Available in your account</p>
              <p class="contact-hours">Instant support for<br>registered customers</p>
            </div>
          </div>
          
          <div class="emergency-contact">
            <div class="emergency-card">
              <div class="emergency-content">
                <div class="emergency-info">
                  <i class="fas fa-exclamation-triangle"></i>
                  <h3>Emergency Contact</h3>
                  <p>For urgent security issues or lost/stolen cards</p>
                  <a href="tel:+31201234999" class="emergency-number">+31 20 123 4999</a>
                  <p class="emergency-note">Available 24/7/365</p>
                </div>
                <div class="emergency-profile">
                  <div class="profile-picture">
                    <img src="@/assets/img/cat.jpg" alt="Emergency Contact Officer" class="profile-img">
                  </div>
                  <div class="name-tag">
                    <span class="employee-name">Chief Security Officer</span>
                    <span class="employee-title">Mr. Puss</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import "../assets/main.css";

export default {
  name: "HomePage",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.homepage-container {
  min-height: 100vh;
}

// Hero Section
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="75" cy="75" r="0.5" fill="rgba(255,255,255,0.03)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.5;
  }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
  
  i {
    color: #ffd700;
  }
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  font-weight: 300;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.8;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  
  &.btn-primary {
    background: linear-gradient(45deg, #e74c3c, #c0392b);
    border: none;
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(231, 76, 60, 0.4);
    }
  }
  
  &.btn-outline-light {
    border: 2px solid rgba(255, 255, 255, 0.3);
    color: white;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-2px);
      color: white;
      text-decoration: none;
    }
  }
}

.hero-features {
  display: grid;
  gap: 1.5rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.2);
  }
  
  i {
    font-size: 2.5rem;
    color: #ffd700;
    margin-bottom: 1rem;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
    margin: 0;
  }
}

// Common Section Styles
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 0;
}

// About Section
.about-section {
  background: #f8f9fa;
}

.about-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  align-items: start;
}

.about-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  
  h3 {
    color: #2c3e50;
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 1rem;
    
    i {
      color: #3498db;
    }
  }
  
  p {
    color: #5d6d7e;
    line-height: 1.6;
    margin: 0;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .stat-label {
    font-size: 0.9rem;
    opacity: 0.9;
  }
}

// Contact Section
.contact-section {
  background: white;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.contact-methods {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.contact-card {
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(102, 126, 234, 0.3);
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}

.contact-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  i {
    font-size: 2rem;
    color: white;
  }
}

.contact-card h3 {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.contact-detail {
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.contact-hours {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.emergency-contact {
  display: flex;
  justify-content: center;
}

.emergency-card {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  max-width: 600px;
  
  .emergency-content {
    display: flex;
    align-items: center;
    gap: 2rem;
    text-align: left;
  }
  
  .emergency-info {
    flex: 1;
    
    i {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #ffd700;
    }
    
    h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 1rem;
      opacity: 0.9;
    }
  }
  
  .emergency-profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #ffd700;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.name-tag {
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  .employee-name {
    display: block;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  
  .employee-title {
    display: block;
    font-size: 1.1rem;
    font-weight: 700;
    color: #3498db;
  }
}

.emergency-number {
  display: block;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffd700;
  text-decoration: none;
  margin-bottom: 0.5rem;
  
  &:hover {
    color: white;
  }
}

.emergency-note {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.about-card, .contact-card, .feature-card {
  animation: fadeInUp 0.6s ease-out;
}

// Responsive Design
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .section-container {
    padding: 3rem 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .contact-methods {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .emergency-card .emergency-content {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-content {
    padding: 0 1rem;
  }
}
</style>
