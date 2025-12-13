import qrcode from "/images/footer/Qrcode.png";
import googlePlay from "/images/footer/GooglePlay.png";
import applePlay from "/images/footer/AppStore.png";
import facebookIcon from "/images/footer/Icon-Facebook.png";
import instagramIcon from "/images/footer/icon-instagram.png";
import twitterIcon from "/images/footer/Icon-Twitter.png";
import linkedInIcon from "/images/footer/Icon-Linkedin.png";

export function DownloadApp() {
  return (
    <section className="flex flex-col gap-4">
      <p className="font-medium text-[1.25em]">Download App</p>
      <p>Save upto $3 using the app.</p>
      <div className="grid grid-cols-2 grid-rows-1">
        <a href="https://play.google.com/store/apps">
          <img src={qrcode} alt="QR Code to download the app" className="" />
        </a>
        <div>
          <a href="https://play.google.com/store/apps">
            <img src={googlePlay} alt="Download on Google Play" />
          </a>
          <a href="https://www.apple.com/app-store/">
            <img src={applePlay} alt="Download on Apple store" />
          </a>
        </div>
      </div>
      <address className="not-italic flex gap-3 justify-between">
        <a href="https://www.facebook.com/dennis.soulster.7">
          <img src={facebookIcon} alt="Find us on Facebook." />
        </a>
        <a href="https://www.instagram.com/solov_oi/">
          <img src={instagramIcon} alt="See us on Instagram" />
        </a>
        <a href="https://x.com/solovoi254">
          <img src={twitterIcon} alt="Follow us on X formerly Twitter." />
        </a>
        <a href="https://www.linkedin.com/in/dennis-n-murimi/">
          <img src={linkedInIcon} alt="Let's connect on LinkedIn" />
        </a>
      </address>
    </section>
  );
}
