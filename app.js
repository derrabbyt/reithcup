// Your form endpoint (viewform -> formResponse)
const FORM_POST_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSdBDQGNgqUCuihSwIJ-7g0dH3kkBMERTUuMEBTBBWcjpwr6xg/formResponse";

window.vote = async function (entryId, choice) {
    const msg = document.getElementById("msg");
    msg.textContent = `Submitting vote: ${choice} ...`;

    const data = new URLSearchParams();
    data.append(entryId, choice);

    // no-cors is required because Google Forms blocks CORS.
    // You can't read the response, but the submission is accepted.
    try {
        await fetch(FORM_POST_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: data.toString(),
        });
        msg.textContent = `✅ Vote recorded: ${choice}`;
    } catch (e) {
        msg.textContent = `❌ Submit failed. Try again.`;
    }
};
