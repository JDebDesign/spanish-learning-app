import { useState } from 'react'
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import type { SongEntry } from '@/shared/data/songCatalog'

interface SongDropdownProps {
  currentSong: SongEntry
  songs: SongEntry[]
  onSelectSong: (song: SongEntry) => void
}

export function SongDropdown({ currentSong, songs, onSelectSong }: SongDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (song: SongEntry) => {
    if (song.hasData) {
      onSelectSong(song)
    }
    handleClose()
  }

  return (
    <>
      <Button
        onClick={handleClick}
        disableRipple
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'inherit',
          textTransform: 'none',
          px: 0,
          minWidth: 0,
          '&:hover': { bgcolor: 'transparent' },
        }}
        aria-label="Select song"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, color: '#f9fafb' }}>
            {currentSong.title}
          </Typography>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#c7b8e6' }}>
            {currentSong.artist}
          </Typography>
        </Box>
        {open ? (
          <KeyboardArrowUpIcon sx={{ color: '#c7b8e6', fontSize: 20 }} />
        ) : (
          <KeyboardArrowDownIcon sx={{ color: '#c7b8e6', fontSize: 20 }} />
        )}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 382,
              maxWidth: 'calc(100vw - 48px)',
              bgcolor: '#16003b',
              border: '1px solid #4a2f7a',
              borderRadius: '12px',
              p: 1,
              '& .MuiList-root': { py: 0 },
            },
          },
        }}
        MenuListProps={{
          'aria-labelledby': 'song-dropdown-button',
        }}
      >
        {songs.map((song) => {
          const isCurrent = song.id === currentSong.id
          return (
            <MenuItem
              key={song.id}
              onClick={() => handleSelect(song)}
              disabled={!song.hasData}
              sx={{
                borderBottom: '1px solid #4a2f7a',
                py: 1.25,
                px: 1.5,
                '&:last-of-type': { borderBottom: 'none' },
                ...(isCurrent && { bgcolor: 'rgba(74, 47, 122, 0.3)' }),
                '&:hover': { bgcolor: 'rgba(233, 213, 255, 0.08)' },
                '&.Mui-disabled': { opacity: 0.6 },
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, width: '100%' }}>
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#f9fafb',
                  }}
                >
                  {song.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: 14,
                      color: '#c7b8e6',
                    }}
                  >
                    {song.artist}
                  </Typography>
                  {isCurrent && (
                    <>
                      <Box
                        sx={{
                          width: 2,
                          height: 2,
                          borderRadius: '50%',
                          bgcolor: '#c7b8e6',
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: 'Inter',
                          fontWeight: 500,
                          fontSize: 14,
                          color: '#c7b8e6',
                        }}
                      >
                        Now playing
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
