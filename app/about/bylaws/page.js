import PageHero from 'core/page-hero';

export const metadata = { title: 'Bylaws' };

const docUrl = 'https://docs.google.com/document/d/1CE2W-2DxxtAYjgo1ekNAxeetMH5Lh5jOGSfVQWza5Rs/edit?usp=sharing';
const embedUrl = 'https://docs.google.com/document/d/e/2PACX-1vR7183FUdSVVw3anhEJlSmYbjjzYwtYXhk7bt04RpVnG-WdI876cEPto0XiVpntdygdRlTdcje-g6T1/pub?embedded=true';

export default function Bylaws() {
  return (
    <>
      <PageHero title="Bylaws" label="About" />
      <div className="brew-section">
        <div className="brew-container max-w-4xl">
          <div className="brew-card-flat p-4 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <span className="brew-label">Club Bylaws</span>
              <a href={docUrl} target="_blank" rel="noopener noreferrer" className="brew-btn-outline text-sm py-2 px-4">
                Open in Google Docs
              </a>
            </div>
            <div className="rounded-lg overflow-hidden border border-brew-border bg-white">
              <iframe src={embedUrl} className="w-full" style={{ height: '75vh', border: 0 }} title="Club Bylaws" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
