<svelte:head>
  <!-- Meta par défaut (surchargées par les pages) -->
  <meta name="robots" content="index, follow" />
</svelte:head>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #654074;
    min-height: 100vh;
  }

  :global(.container) {
    display: flex;
    min-height: 100vh;
  }

  :global(.book-image) {
    flex: 0.6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.book-image img) {
    width: 100%;
    height: auto;
  }

  :global(h1) {
    font-size: 2.5rem;
    line-height: 1em;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  :global(p) {
    margin-bottom: 2rem;
    color: #666;
  }

  :global(.signup-form) {
    flex: 0.4;
    background: white;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 5rem;
  }

  :global(.social-links) {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  :global(.social-links a) {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 6px 12px;
    border-radius: 4px;
    text-decoration: none;
    color: #666;
    font-weight: 400;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    border: 1px solid #e0e0e0;
    background: transparent;
  }

  :global(.social-links a:hover) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    color: #333;
  }

  :global(.social-links .instagram:hover) {
    border-color: #e6683c;
    color: #e6683c;
  }

  :global(.social-links .youtube:hover) {
    border-color: #ff0000;
    color: #ff0000;
  }

  :global(.social-links svg) {
    width: 16px;
    height: 16px;
    fill: currentColor;
  }

  :global(.form-group) {
    margin-bottom: 1.5rem;
  }

  :global(input[type="email"]) {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  :global(input[type="email"]:focus) {
    outline: none;
    border-color: #654074;
  }

  :global(button) {
    background-color: #654074;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  :global(button:hover) {
    background-color: #52335d;
  }

  @media (max-width: 768px) {
    :global(.container) {
      flex-direction: column;
    }

    :global(.book-image) {
      padding: 1rem;
    }

    :global(.signup-form) {
      padding: 2rem;
    }

    :global(.placeholder) {
      display: none;
    }
  }

  /* Page générique (ex: /fat) */
  :global(.page) {
    min-height: 100vh;
    background: white;
    padding: 4rem 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  :global(.page a) {
    color: #654074;
    text-decoration: none;
    font-weight: 500;
  }

  :global(.page a:hover) {
    text-decoration: underline;
  }
</style>

<slot />
