import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="landingPage">
      <section class="view">
        <h1>Welcome to Easypoll</h1>
        <p>Create and share real-time polls in seconds.</p>
        <button class="cta-button">Get Started</button>
      </section>

      <section class="features">
        <div class="feature">
          <h2>Instant Polls</h2>
          <p>
            Get started as a host and get the opportunity to: 
            - Create sessions
            - Set up a poll
            - Get live feedback from your audience in real time.
          </p>
        </div>
        <div class="feature">
          <h2>No Signup Needed</h2>
          <p>
            Input your details and session code and start polling instantly. 
            No login required!
          </p>
        </div>
        <div class="feature">
          <h2>Easy Sharing</h2>
          <p>
            Share your session with a simple code. 
            Anyone can participate!
          </p>
        </div>
      </section>

      <footer class="footer">
        © 2025 Easypoll. Built for real-time interaction.
      </footer>
  </div>
`

setupCounter(document.querySelector('#counter'))
