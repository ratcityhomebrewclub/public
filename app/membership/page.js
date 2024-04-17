
export default function Membership() {
  const mapStyle = {
    border: 0,
    width: 800,
    height: 600,
    frameborder: 0,
    scrolling: "no"
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section id="membership" className="">
        <div className="dues mb-20">
          <h2 className="text-3xl font-semibold mb-6">Pay Your Dues</h2>
          <p>Club dues are $20 per year, renewable January 1st. (PayPal costs $1 extra for processing.)</p>
        </div>
        
        <div className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-6">1 Year Membership</h3>
            <p>Link TBD</p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-6">1 Year Membership (Auto-Renew)</h3>
            <p>Link TBD</p>
          </div>
        </div>
      </section>
    </main>
  );
}