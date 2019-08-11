import React from 'react'
import styles from './SocialHandles.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons'

const SocialHandles = ({ siteMetadata }) => {
  return (
    <div className={styles.container}>
      <a
        href={siteMetadata.githubHandle}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <a
        href={siteMetadata.linkedInHandle}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FontAwesomeIcon icon={faLinkedin} />
      </a>
    </div>
  )
}

export default SocialHandles
