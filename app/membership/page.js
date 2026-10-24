import PageHero from 'core/page-hero';
import Image from 'next/image';

export const metadata = { title: 'Membership' };

export default function Membership() {
  return (
    <>
      <PageHero title="Membership" />
      <div className="brew-section">
        <div className="brew-container max-w-3xl">

          {/* Intro */}
          <div className="brew-card-flat p-6 md:p-12 text-center mb-8">
            <div className="text-5xl mb-5" aria-hidden="true">🍺</div>
            <h2 className="mb-3">Become a Member</h2>
            <p className="text-stone-400 text-lg mb-1">
              Club dues are{' '}
              <strong className="text-brew-amber-glow">$25 per year</strong>,
              renewable January 1st.
            </p>
            <p className="text-stone-600 text-sm">
              PayPal adds $1 for processing.
            </p>
          </div>

          {/* Payment options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="brew-card-flat p-8 flex flex-col items-center text-center gap-4">
              <h3 className="mt-0">1-Year Membership</h3>
              <p className="text-stone-500 text-sm">One-time annual payment</p>
              <form
                action="https://www.paypal.com/cgi-bin/webscr"
                method="post"
                target="_top"
                className="mt-auto"
              >
                <input name="cmd" type="hidden" value="_s-xclick" />
                <input name="hosted_button_id" type="hidden" value="GZC3F78SXSC5A" />
                <input
                  alt="Pay with PayPal"
                  name="submit"
                  src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif"
                  type="image"
                />
                <Image
                  src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                  alt=""
                  width={1}
                  height={1}
                />
              </form>
            </div>

            <div className="brew-card-flat p-8 flex flex-col items-center text-center gap-4">
              <h3 className="mt-0">Auto-Renew</h3>
              <p className="text-stone-500 text-sm">Renews automatically each year</p>
              <form
                action="https://www.paypal.com/cgi-bin/webscr"
                method="post"
                target="_top"
                className="mt-auto"
              >
                <input name="cmd" type="hidden" value="_s-xclick" />
                <input name="hosted_button_id" type="hidden" value="RJ559WGQ6ZELW" />
                <input
                  alt="Subscribe with PayPal"
                  name="submit"
                  src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif"
                  type="image"
                />
                <Image
                  src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
                  alt=""
                  width={1}
                  height={1}
                />
              </form>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
