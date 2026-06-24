(function () {
  const config = window.COMMUNITY_CANVAS_CONFIG || {};
  const PLACEHOLDER_PATTERN = /^(YOUR_|https:\/\/YOUR-|your-)/i;
  let client = null;

  function isConfigured() {
    return Boolean(
      config.supabaseUrl &&
        config.supabaseAnonKey &&
        !PLACEHOLDER_PATTERN.test(config.supabaseUrl) &&
        !PLACEHOLDER_PATTERN.test(config.supabaseAnonKey)
    );
  }

  function getClient() {
    if (!isConfigured() || !window.supabase) {
      return null;
    }

    if (!client) {
      client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    }

    return client;
  }

  function getBucketName() {
    return config.artworkBucket || "community-canvas-artwork";
  }

  function getPublicArtworkUrl(path) {
    const supabase = getClient();

    if (!supabase || !path) {
      return "";
    }

    const result = supabase.storage.from(getBucketName()).getPublicUrl(path);
    return result.data && result.data.publicUrl ? result.data.publicUrl : "";
  }

  function cleanText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function getFileExtension(file) {
    const extension = String(file && file.name ? file.name.split(".").pop() : "").toLowerCase();

    if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
      return extension === "jpg" ? "jpeg" : extension;
    }

    if (file && file.type === "image/png") {
      return "png";
    }

    if (file && file.type === "image/webp") {
      return "webp";
    }

    return "jpeg";
  }

  window.communityCanvas = {
    config,
    isConfigured,
    getClient,
    getBucketName,
    getPublicArtworkUrl,
    cleanText,
    getFileExtension
  };
})();
