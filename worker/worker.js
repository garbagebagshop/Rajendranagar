export default {
  async fetch(request, env) {
    return new Response("Backend is now hosted on Google Sheets.", { status: 200 });
  },
};