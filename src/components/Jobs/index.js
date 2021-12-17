import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobItem from '../JobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

export default class Jobs extends Component {
  // const {employmentTypesList, salaryRangesList} = this.props

  state = {
    profileDetails: '',
    jobDetails: [],
    employmentType: [],
    minimumPackage: '',
    search: '',
    apiProfileStatus: apiStatusConstants.initial,
    apiJobsStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.renderProfile()
    this.renderJobs()
  }

  newProfile = profile => ({
    name: profile.name,
    profileImageUrl: profile.profile_image_url,
    shortBio: profile.short_bio,
  })

  // Fetching Job Profile
  renderProfile = async () => {
    // const {profileDetails} = this.state
    this.setState({
      apiProfileStatus: apiStatusConstants.inProgress,
    })
    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(profileUrl, options)
    const data = await response.json()
    console.log(response)
    if (response.ok) {
      const updatedProfile = this.newProfile(data.profile_details)
      //   console.log(updatedProfile)
      this.setState({
        profileDetails: updatedProfile,
        apiProfileStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiProfileStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSetProfile = () => {
    const {profileDetails} = this.state
    // console.log(profileDetails)
    return (
      <div className="profile-card">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-img"
        />
        <h1 className="profile-name">{profileDetails.name}</h1>
        <p className="profile-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  // Fetching Jobs From Api
  renderJobs = async () => {
    this.setState({
      apiJobsStatus: apiStatusConstants.inProgress,
    })
    const {employmentType, minimumPackage, search} = this.state
    console.log(employmentType)
    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${minimumPackage}&search=${search}`
    // console.log(jobsUrl)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsUrl, options)
    const data = await response.json()
    console.log(response)
    if (response.ok === true) {
      const updatedJobs = data.jobs.map(item => ({
        id: item.id,
        companyLogoUrl: item.company_logo_url,
        employmentType: item.employment_type,
        jobDescription: item.job_description,
        location: item.location,
        packagePerAnnum: item.package_per_annum,
        rating: item.rating,
        title: item.title,
      }))
      this.setState({
        jobDetails: updatedJobs,
        apiJobsStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiJobsStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobsContainer = () => {
    const {jobDetails} = this.state
    const showJobDetails = jobDetails.length > 0
    return showJobDetails ? (
      <ul className="job-item-card">
        {jobDetails.map(item => (
          <JobItem key={item.id} item={item} />
        ))}
      </ul>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div className="failure-profile-card profile-card">
      <button
        type="button"
        className="retry-button"
        onClick={this.renderProfile}
      >
        Retry
      </button>
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
      <div>
        <button
          type="button"
          className="retry-button"
          onClick={this.renderJobs}
        >
          Retry
        </button>
      </div>
    </div>
  )

  changeEmploymentTypeId = id => {
    const {employmentType} = this.state
    const newEmploymentType = [...employmentType]
    const CheckedEmpType = newEmploymentType.includes(id)
    console.log(CheckedEmpType)

    if (CheckedEmpType) {
      const index = newEmploymentType.indexOf(id)
      newEmploymentType.splice(index, 1)
    } else {
      newEmploymentType.push(id)
    }
    this.setState({employmentType: newEmploymentType}, this.renderJobs)
    console.log(newEmploymentType)
  }

  changeSalaryId = id => {
    this.setState({minimumPackage: id}, this.renderJobs)
    // console.log(minimumPackage)
  }

  onChangeSearch = e => {
    this.setState({search: e.target.value})
  }

  onClickSearch = () => {
    this.renderJobs()
  }

  renderProfileDetails = () => {
    const {apiProfileStatus} = this.state

    switch (apiProfileStatus) {
      case apiStatusConstants.success:
        return this.renderSetProfile()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobDetails = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiStatusConstants.success:
        return this.renderJobsContainer()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {minimumPackage} = this.state
    const {employmentTypesList, salaryRangesList} = this.props
    // console.log(jobDetails)
    return (
      <>
        <Header />
        <div className="jobs-main-container">
          <div className="filter-bar">
            <span className="mobile-input-container">
              <input
                type="search"
                placeholder="Search"
                className="input-search"
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-button"
                onClick={this.onClickSearch}
              >
                <BsSearch className="search-icon" />
              </button>
            </span>
            <div className="profile-container">
              {this.renderProfileDetails()}
            </div>
            <hr className="hr-line" />
            <h1 className="filter-headings">Type Of Employment</h1>
            <ul className="employment-types">
              {employmentTypesList.map(item => (
                <EmploymentType
                  key={item.employmentTypeId}
                  item={item}
                  changeEmploymentTypeId={this.changeEmploymentTypeId}
                  //   isChecked={item.employmentTypeId === activeEmploymentId}
                />
              ))}
            </ul>
            <hr className="hr-line" />
            <h1 className="filter-headings">Salary Range</h1>
            <ul className="employment-types">
              {salaryRangesList.map(item => (
                <SalaryType
                  key={item.salaryRangeId}
                  item={item}
                  changeSalaryId={this.changeSalaryId}
                  isChecked={item.salaryRangeId === minimumPackage}
                />
              ))}
            </ul>
          </div>
          <div className="right-result-card">
            <span className="input-container">
              <input
                type="search"
                placeholder="Search"
                className="input-search"
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-button"
              >
                <BsSearch
                  className="search-icon"
                  onClick={this.onClickSearch}
                />
              </button>
            </span>
            <div className="job-cards-container">{this.renderJobDetails()}</div>
          </div>
        </div>
      </>
    )
  }
}

// Employment Filter Component
const EmploymentType = ({item, changeEmploymentTypeId}) => {
  const {label, employmentTypeId} = item
  //   console.log(isChecked)
  //   const onClickCheckBox = () => {
  //     // changeEmploymentTypeId(employmentTypeId, e.target.checked)
  //     // console.log(employmentTypeId)
  //   }

  const onChangeValue = () => {
    changeEmploymentTypeId(employmentTypeId)
    // console.log(e.target.checked)
  }
  return (
    <li className="checkbox-employment">
      <input
        id={employmentTypeId}
        type="checkbox"
        name="employment"
        onChange={onChangeValue}
      />
      <label htmlFor={employmentTypeId} className="label">
        {label}
      </label>
    </li>
  )
}

// Salary Filter Component
const SalaryType = ({item, isChecked, changeSalaryId}) => {
  const {label, salaryRangeId} = item
  const onClickSalaryBtn = () => {
    changeSalaryId(salaryRangeId)
  }
  return (
    <li className="checkbox-employment">
      <input
        id={label}
        type="radio"
        checked={isChecked}
        onChange={onClickSalaryBtn}
      />
      <label htmlFor={label} className="label">
        {label}
      </label>
    </li>
  )
}
