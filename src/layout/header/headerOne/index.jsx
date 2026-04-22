'use client'
import ThemeOptionContext from '@/context/themeOptionsContext'
import { useHeaderScroll } from '@/utils/hooks/HeaderScroll'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { RiHeartLine, RiLogoutBoxRLine, RiMenuLine, RiUserLine, RiDashboardLine } from 'react-icons/ri'
import { Button, Col, Container, Row } from 'reactstrap'
import HeaderCart from '../widgets/headerCart'
import HeaderLogo from '../widgets/HeaderLogo'
import MainHeaderMenu from '../widgets/mainHeaderMenu'
import TopBar from '../widgets/TopBar'
import { useTranslation } from 'react-i18next'

const HeaderOne = () => {
  const { themeOption, setOpenAuthModal, openAuthModal, mobileSideBar, setMobileSideBar } = useContext(ThemeOptionContext)
  const UpScroll = useHeaderScroll(false)
  const { t } = useTranslation('common')
  const router = useRouter()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    setIsAuthenticated(!!Cookies.get('uat'))
    try {
      const account = JSON.parse(Cookies.get('account') || '{}')
      setIsAdmin(account?.role?.name === 'admin')
    } catch {
      setIsAdmin(false)
    }
  }, [openAuthModal])

  const handleProfileClick = (e) => {
    e.preventDefault()
    isAuthenticated ? router.push('/account/dashboard') : setOpenAuthModal(true)
  }
  const handleWishlistClick = (e) => {
    e.preventDefault()
    isAuthenticated ? router.push('/wishlist') : setOpenAuthModal(true)
  }
  const handleLogout = (e) => {
    e.preventDefault()
    Cookies.remove('uat', { path: '/' })
    Cookies.remove('account')
    Cookies.remove('ue')
    localStorage.clear()
    setIsAuthenticated(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className={`${themeOption?.header?.sticky_header_enable && UpScroll ? 'sticky fixed' : ''}`}>
      {themeOption?.header?.page_top_bar_enable && <TopBar />}
      <div className="metro">
        <Container>
          <Row>
            <Col sm="12">
              <div className="main-menu">
                <div className="menu-left">
                  <div className="toggle-nav" onClick={() => setMobileSideBar(!mobileSideBar)}>
                    <RiMenuLine className="sidebar-bar" />
                  </div>
                  <div className="brand-logo">
                    <HeaderLogo />
                  </div>
                </div>

                <div className="menu-right pull-right">
                  <div className="main-navbar">
                    <div id="mainnav">
                      <div className="header-nav-middle">
                        <div className="main-nav navbar navbar-expand-xl navbar-light navbar-sticky">
                          <div className={`offcanvas offcanvas-collapse order-xl-2 ${mobileSideBar ? 'show' : ''}`}>
                            <div className="offcanvas-header navbar-shadow">
                              <h5>{t('Menu')}</h5>
                              <Button close className="lead" id="toggle_menu_btn" type="button" onClick={() => setMobileSideBar(false)}>
                                <div><i className="ri-close-fill"></i></div>
                              </Button>
                            </div>
                            <div className="offcanvas-body">
                              <MainHeaderMenu />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="icon-nav">
                      <ul>
                        <li className="onhover-div">
                          <a href="#" onClick={handleWishlistClick}>
                            <RiHeartLine />
                          </a>
                        </li>
                        <li className="onhover-div">
                          <HeaderCart />
                        </li>
                        <li className="onhover-div">
                          <a href="#" onClick={handleProfileClick}>
                            <RiUserLine />
                          </a>
                        </li>
                        {isAuthenticated && isAdmin && (
                          <li className="onhover-div">
                            <a href="http://localhost:3001" target="_blank" title="Admin Panel">
                              <RiDashboardLine />
                            </a>
                          </li>
                        )}
                        {isAuthenticated && (
                          <li className="onhover-div">
                            <a href="#" onClick={handleLogout} title={t('LogOut')}>
                              <RiLogoutBoxRLine />
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </header>
  )
}

export default HeaderOne
