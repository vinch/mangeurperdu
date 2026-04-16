<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <p class="copyright">Copyright &copy; {currentYear} Mangeur Perdu</p>
    <div class="footer-links" aria-label="Réseaux sociaux">
      <a
        href="https://www.instagram.com/mangeurperdu"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        title="Instagram"
      >
        <svg
          viewBox="0 0 32 32"
          width="22"
          height="22"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M20.445 5h-8.891A6.559 6.559 0 0 0 5 11.554v8.891A6.559 6.559 0 0 0 11.554 27h8.891a6.56 6.56 0 0 0 6.554-6.555v-8.891A6.557 6.557 0 0 0 20.445 5zm4.342 15.445a4.343 4.343 0 0 1-4.342 4.342h-8.891a4.341 4.341 0 0 1-4.341-4.342v-8.891a4.34 4.34 0 0 1 4.341-4.341h8.891a4.342 4.342 0 0 1 4.341 4.341l.001 8.891z"
          />
          <path
            d="M16 10.312c-3.138 0-5.688 2.551-5.688 5.688s2.551 5.688 5.688 5.688 5.688-2.551 5.688-5.688-2.55-5.688-5.688-5.688zm0 9.163a3.475 3.475 0 1 1-.001-6.95 3.475 3.475 0 0 1 .001 6.95zM21.7 8.991a1.363 1.363 0 1 1-1.364 1.364c0-.752.51-1.364 1.364-1.364z"
          />
        </svg>
      </a>
      <a
        href="https://www.youtube.com/@mangeurperdu"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
        title="YouTube"
      >
        <svg
          viewBox="0 0 32 32"
          width="22"
          height="22"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M24.325 8.309s-2.655-.334-8.357-.334c-5.517 0-8.294.334-8.294.334A2.675 2.675 0 0 0 5 10.984v10.034a2.675 2.675 0 0 0 2.674 2.676s2.582.332 8.294.332c5.709 0 8.357-.332 8.357-.332A2.673 2.673 0 0 0 27 21.018V10.982a2.673 2.673 0 0 0-2.675-2.673zM13.061 19.975V12.03L20.195 16l-7.134 3.975z"
          />
        </svg>
      </a>
    </div>
  </div>
</footer>

<style>
  .site-footer {
    background: white;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding: 1.25rem var(--mp-shell-pad-x, 1.25rem);
  }

  .footer-inner {
    max-width: var(--mp-shell-max, 1100px);
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .copyright {
    margin: 0;
    color: #56616b;
    font-size: 0.95rem;
  }

  .footer-links {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .footer-links a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.75);
    color: #2c3e50;
    text-decoration: none;
  }

  .footer-links a:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  @media (max-width: 700px) {
    .footer-inner {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>

