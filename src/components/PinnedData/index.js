import { useRouter } from 'next/router'
import { Bookmark, ChevronRight, X } from 'react-feather'
import styled from 'styled-components'

import { Hover } from 'components'
import { ButtonFaded } from 'components/ButtonStyled'
import { AutoColumn } from 'components/Column'
import FormattedName from 'components/FormattedName'
import { RowBetween, RowFixed } from 'components/Row'
import TokenLogo from 'components/TokenLogo'

import { useSavedTokens } from 'contexts/LocalStorage'
import { TYPE } from 'Theme'
import { tokenIconUrl } from 'utils'

const RightColumn = styled.div`
  position: fixed;
  right: 0;
  top: 0px;
  height: 100vh;
  width: ${({ open }) => (open ? '160px' : '23px')};
  padding: 1.25rem;
  border-left: ${({ theme, open }) => '1px solid' + theme.bg3};
  background-color: ${({ theme }) => theme.bg1};
  z-index: 9999;
  :hover {
    cursor: pointer;
  }

  @media screen and (max-width: ${({ theme }) => theme.bpLg}) {
    display: none;
  }
`

const SavedButton = styled(RowBetween)`
  padding-bottom: ${({ open }) => open && '20px'};
  border-bottom: ${({ theme, open }) => open && '1px solid' + theme.bg3};
  margin-bottom: ${({ open }) => open && '1.25rem'};

  :hover {
    cursor: pointer;
  }
`

const ScrollableDiv = styled(AutoColumn)`
  overflow: auto;
`

const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text2};
`

function PinnedData({ open, setSavedOpen }) {
  const router = useRouter()
  const { savedTokens, removeToken } = useSavedTokens()

  return !open ? (
    <RightColumn open={open} onClick={() => setSavedOpen(true)}>
      <SavedButton open={open}>
        <StyledIcon>
          <Bookmark size={20} />
        </StyledIcon>
      </SavedButton>
    </RightColumn>
  ) : (
    <RightColumn gap="1rem" open={open}>
      <SavedButton onClick={() => setSavedOpen(false)} open={open}>
        <RowFixed>
          <StyledIcon>
            <Bookmark size={16} />
          </StyledIcon>
          <TYPE.main ml={'4px'}>Saved</TYPE.main>
        </RowFixed>
        <StyledIcon>
          <ChevronRight />
        </StyledIcon>
      </SavedButton>
      <AutoColumn gap="40px" style={{ marginTop: '2rem' }}>
        <ScrollableDiv gap={'12px'}>
          <TYPE.main>Pinned Protocols</TYPE.main>
          {Object.keys(savedTokens).filter(key => {
            return !!savedTokens[key]
          }).length > 0 ? (
            Object.keys(savedTokens)
              .filter(address => {
                return !!savedTokens[address]
              })
              .map(address => {
                const token = savedTokens[address]
                return (
                  <RowBetween key={address}>
                    <ButtonFaded
                      onClick={() => router.push('/protocol/' + token.protocol.toLowerCase().replace(' ', '-'))}
                    >
                      <RowFixed>
                        <TokenLogo logo={tokenIconUrl(token?.protocol)} size={'14px'} />
                        <TYPE.header ml={'6px'}>
                          <FormattedName text={token.protocol} maxCharacters={12} fontSize={'12px'} />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removeToken(address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
          ) : (
            <TYPE.light>Pinned protocols will appear here.</TYPE.light>
          )}
        </ScrollableDiv>
      </AutoColumn>
    </RightColumn>
  )
}

export default PinnedData
