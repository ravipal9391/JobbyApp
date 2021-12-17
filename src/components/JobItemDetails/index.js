import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

export default class JobItemDetails extends Component {
  state = {
    jobItem: {},
    similarJobs: [],
    skills: [],
    lifeAtCompany: {},
    apiJobItemStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItem()
  }

  getLifeAtCompany = item => ({
    description: item.description,
    imageUrl: item.image_url,
  })

  getFormattedSkills = item => ({
    name: item.name,
    imageUrl: item.image_url,
  })

  getFormattedData = item => ({
    id: item.id,
    companyLogoUrl: item.company_logo_url,
    companyWebsiteUrl: item.company_website_url,
    employmentType: item.employment_type,
    jobDescription: item.job_description,
    location: item.location,
    packagePerAnnum: item.package_per_annum,
    rating: item.rating,
    title: item.title,
    skills: item.skills.map(skill => this.getFormattedSkills(skill)),
  })

  getJobItem = async () => {
    this.setState({
      apiJobItemStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    // console.log(this.props)
    const {params} = match
    const {id} = params
    const profileUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data.job_details)
      const updatedSimilarObjects = data.similar_jobs.map(item => ({
        id: item.id,
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      const updatedLifeAtCompany = this.getLifeAtCompany(
        data.job_details.life_at_company,
      )
      const updatedSkill = data.job_details.skills.map(skill =>
        this.getFormattedSkills(skill),
      )
      this.setState({
        jobItem: updatedData,
        similarJobs: updatedSimilarObjects,
        lifeAtCompany: updatedLifeAtCompany,
        skills: updatedSkill,
        apiJobItemStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobItemStatus: apiStatusConstants.failure})
    }
  }

  renderSkills = skill => (
    <li className="skill-container">
      <img src={skill.imageUrl} alt={skill.name} className="skill-logo" />
      <h1>{skill.name}</h1>
    </li>
  )

  renderJobItem = () => {
    const {jobItem, skills, lifeAtCompany} = this.state
    const {
      companyWebsiteUrl,
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItem
    console.log(lifeAtCompany)
    return (
      <>
        <div className="job-card">
          <div className="logo-title-card">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-card">
              <h1 className="title">{title}</h1>
              <span className="rating">
                <AiFillStar className="star" />
                {rating}
              </span>
            </div>
          </div>
          <div>
            <div className="location-employment-package-card">
              <div className="location-employment-card">
                <div className="location-employment">
                  <MdLocationOn className="icon" />
                  <span>{location}</span>
                </div>
                <div className="location-employment">
                  <BsBriefcaseFill className="icon" />
                  <span>{employmentType}</span>
                </div>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr className="hr-lined" />
            <div className="descrip-link-row">
              <h1 className="description-head">Description</h1>
              <Link
                to={companyWebsiteUrl}
                target="_blank"
                className="external-website-link"
              >
                <span>Visit</span>
                <FiExternalLink />
              </Link>
            </div>
            <p className="description">{jobDescription}</p>
            <h1 className="job-items-headings">Skills</h1>
            <ul className="skills-main-container">
              {skills.map(skill => (
                <Skill key={skill.name} skill={skill} />
              ))}
            </ul>
            <h1 className="job-items-headings">Life At Company</h1>
            <div className="life-at-company-card">
              <p className="life-at-company-descript description">
                {lifeAtCompany.description}
              </p>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
          </div>
        </div>
        {this.renderSimilarJobs()}
      </>
    )
  }

  renderSimilarJobs = () => {
    const {similarJobs} = this.state
    return (
      <div className="similar-jobs-container">
        <h1 className="similar-main-head">Similar Jobs</h1>
        <ul className="similar-job-container">
          {similarJobs.map(item => (
            <SimilarJobs key={item.id} similar={item} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-failure-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="retry-button" onClick={this.getJobItem}>
        Retry
      </button>
    </div>
  )

  renderJobItemDetails = () => {
    const {apiJobItemStatus} = this.state

    switch (apiJobItemStatus) {
      case apiStatusConstants.success:
        return this.renderJobItem()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="job-item-details-container">
          <div className="job-item-container">
            {this.renderJobItemDetails()}
          </div>
        </div>
      </div>
    )
  }
}

// Skills Component
const Skill = props => {
  const {skill} = props
  console.log(skill)
  const {name, imageUrl} = skill
  return (
    <li className="skill-container">
      <img src={imageUrl} alt={name} className="skill-logo" />
      <h1 className="main-head">{name}</h1>
    </li>
  )
}

// Similar Jobs Component
const SimilarJobs = props => {
  const {similar} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similar

  //   const redirectToOther = () => <Redirect to={`/jobs/${id}`} />
  return (
    <li className="similar-card">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="similar-logo logo-title-card">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="company-logo"
          />
          <div className="title-rating-card">
            <h1 className="similar-title title">{title}</h1>
            <span className="rating">
              <AiFillStar className="star" />
              {rating}
            </span>
          </div>
        </div>
        <div>
          <h1 className="description-head">Description</h1>
          <p className="similar-descrip description">{jobDescription}</p>
          <div className="similar-location location-employment-card">
            <div className="location-employment">
              <MdLocationOn className="icon" />
              <span className="similar-job-icons-heads">{location}</span>
            </div>
            <div className="location-employment">
              <BsBriefcaseFill className="icon" />
              <span className="similar-job-icons-heads">{employmentType}</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}
