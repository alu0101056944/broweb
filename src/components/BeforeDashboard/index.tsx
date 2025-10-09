import { Banner } from '@payloadcms/ui/elements/Banner'
import Image from 'next/image'
import React from 'react'

import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
 return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Panel de control para la página de portfolio <a href='https://broweb-frontend.vercel.app/'>https://broweb-frontend.vercel.app/</a></h4>
      </Banner>
      
      <p style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        Este es el panel de administración de tu sitio web. Desde aquí puedes gestionar todo el contenido. 
        Aquí tienes una guía rápida para empezar:
      </p>

      <br></br>

      <Image 
        src="/bienvenida_videos.png" 
        alt="Ilustración de bienvenida al panel"
        width="547"
        height="515"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      />
      <br>
      </br>
      <br></br>
      <ul className={`${baseClass}__instructions`}>
        <li>
          <strong>Gestionar Vídeos:</strong> Para añadir un nuevo vídeo, ve a la colección &quot;Videos&quot; en la barra lateral de la izquierda. Los vídeos que añadas aquí aparecerán en la galería de vídeos del sitio web tras desplegarlo pulsando en el botón de despliegue (&quot;Deploy Frontend&quot;) a la izquierda.
        </li>
        <br></br>
        <li>
          <strong>Ver Usuarios:</strong> Puedes ver la lista de todos los usuarios del sitio haciendo clic en &quot;Users&quot; en la barra lateral.
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
