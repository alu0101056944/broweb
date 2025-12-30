import { Banner } from '@payloadcms/ui/elements/Banner'
import Image from 'next/image'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>
          Control panel for the portfolio page{' '}
          <a href="https://www.davidjbarrios.com/">https://www.davidjbarrios.com/</a>
        </h4>
      </Banner>

      <Banner>
        <h3 style={{ marginTop: 0, color: 'var(--theme-success-500)' }}>Quick Guide</h3>
        <p style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          Welcome to your administration panel. Here is how to manage your content effectively:
        </p>

        <br />

        <Image
          src="/bienvenida_videos.png"
          alt="Dashboard welcome illustration"
          width="547"
          height="515"
          style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
        />

        <br />

        <ul className={`${baseClass}__instructions`}>
          <li>
            <strong> Manage Global Collections: </strong>
            Use the <strong>Videos</strong> and <strong>Music</strong> links in the sidebar to
            upload your core media. These act as a library that you can later reference inside your
            pages.
          </li>

          <br />

          <li>
            <strong> Building Pages with Blocks: </strong>
            When editing a page, you use <strong>Content Blocks</strong> to build the layout. You
            can add, remove, and reorder these:
            <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', listStyleType: 'circle' }}>
              <li>
                <strong>Rich Text:</strong> For standard text, lists, and formatting.
              </li>
              <li>
                <strong>Image & Video Blocks:</strong> To display single media items with custom
                alignment.
              </li>
              <li>
                <strong>Text with Image/Video/HTML:</strong> Creates a split-screen layout where
                text sits next to media.
              </li>
              <li>
                <strong>Media Grid:</strong> Use this to create a gallery by selecting items from
                your Video or Music collections.
              </li>
              <li>
                <strong>HTML Block:</strong> For advanced users to embed custom code or external
                widgets.
              </li>
            </ul>
          </li>

          <br />

          <li>
            <strong>Fine-tuning Layouts: </strong>
            Most blocks have settings in the <strong>Sidebar</strong> (right side of the editor).
            There you can adjust image alignment, text width percentages, and padding to make the
            content look exactly how you want.
          </li>

          <br />

          <li>
            <strong>Image Dimensions: </strong>
            When you provide an Image URL, the system automatically calculates the width and height
            for you upon saving to ensure the website loads efficiently.
          </li>

          <br />

          <li>
            <strong>Make it Live: </strong>
            Changes in this panel are saved to the database immediately, but to see them on the live
            website, remember to click the <strong>&quot;Deploy Frontend&quot;</strong> button in
            the sidebar.
          </li>
        </ul>
      </Banner>
    </div>
  )
}

export default BeforeDashboard
