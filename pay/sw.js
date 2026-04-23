self.addEventListener("canmakepayment", (e) => e.respondWith(true));

self.addEventListener("paymentrequest", async (event) => {

  event.respondWith(new Promise(async (resolve, reject) => {
    try {
      const client = await event.openWindow("./navigate.html");

      if (!client) return reject("Failed to open window.");

      /**
       * @type { string }
       */
      const url = event.methodData[0].data?.url;

      client.postMessage({
        url: url.match(/https?:\/\//) ? url : "https://www.google.com/"
      });

      // Resolve immediately to complete the payment request
      resolve({
        methodName: "/pay/pay.json",
        details: {
          url: url
        }
      });

    } catch (error) {
      reject(error);
    }
  }));
});
