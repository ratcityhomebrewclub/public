
export default function Membership() {

  return (
    <main className="flex">
      <section id="membership" className="">
        <div className="dues mb-20">
          <h2 className="mb-6">Pay Your Dues</h2>
          <p>Club dues are $20 per year, renewable January 1st. (PayPal costs $1 extra for processing.)</p>
        </div>
        
        <div className="flex flex-row items-center justify-between">
          <div>
            <h3 className="mb-6">1 Year Membership</h3>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input name="cmd" type="hidden" value="_s-xclick" />
              <input name="hosted_button_id" type="hidden" value="GZC3F78SXSC5A" />
              <input alt="PayPal - The safer, easier way to pay online!" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" type="image" />
              <img src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" alt="" width="1" height="1" border="0" />
            </form>
          </div>
          <div>
            <h3 className="mb-6">1 Year Membership (Auto-Renew)</h3>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input name="cmd" type="hidden" value="_s-xclick" />
              <input name="hosted_button_id" type="hidden" value="RJ559WGQ6ZELW" />
              <input alt="PayPal - The safer, easier way to pay online!" name="submit" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" type="image" />
              <img src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" alt="" width="1" height="1" border="0" />
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}