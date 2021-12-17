import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {item} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = item
  return (
    <li className="job-card">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="logo-title-card">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-card">
            <h1 className="title">{title}</h1>
            <span className="rating">
              <AiFillStar className="star" />
              <p>{rating}</p>
            </span>
          </div>
        </div>
        <div>
          <div className="location-employment-package-card">
            <div className="location-employment-card">
              <div className="location-employment">
                <MdLocationOn className="icon" />
                <p>{location}</p>
              </div>
              <div className="location-employment">
                <BsBriefcaseFill className="icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="hr-lined" />
          <h1 className="description-head">Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobItem
