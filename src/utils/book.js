import { getReadTime } from '@/utils/localStorage';
import { realPx } from '@/utils/utils';
export const FONT_SIZE_LIST= [
    {fontSize:12},
    {fontSize:14},
    {fontSize:16},
    {fontSize:18},
    {fontSize:20},
    {fontSize:22}
]

export const FONT_FAMILY= [
    {font:'Default'},
    {font:'Cabin'},
    {font:'Days One'},
    {font:'Montserrat'},
    {font:'Tangerine'}
]

export function ThemeList(vue) {
    return [
        {
          alias: vue.$t('book.themeDefault'),
          name: 'Default',
          style: {
            body: {
              'color': '#4c5059',
              'background': '#cecece',
              'padding-top': `${realPx(48)}px!important`,
              'padding-bottom': `${realPx(48)}px!important`
            }
          }
        },
        {
          alias: vue.$t('book.themeGold'),
          name: 'Gold',
          style: {
            body: {
              'color': '#5c5b56',
              'background': '#c6c2b6',
              'padding-top': `${realPx(48)}px!important`,
              'padding-bottom': `${realPx(48)}px!important`
            }
          }
        },
        {
          alias: vue.$t('book.themeEye'),
          name: 'Eye',
          style: {
            body: {
              'color': '#404c42',
              'background': '#a9c1a9',
              'padding-top': `${realPx(48)}px!important`,
              'padding-bottom': `${realPx(48)}px!important`
            }
          }
        },
        {
          alias: vue.$t('book.themeNight'),
          name: 'Night',
          style: {
            body: {
              'color': '#cecece',
              'background': '#000000',
              'padding-top': `${realPx(48)}px!important`,
              'padding-bottom': `${realPx(48)}px!important`
            }
          }
        }
      ]
}

export function addCss(href) {
  const link = document.createElement('link');
  link.setAttribute('rel','stylesheet');
  link.setAttribute('type','text/css');
  link.setAttribute('href',href);
  document.getElementsByTagName('head')[0].appendChild(link);
}

export function removeCss(href) {
  const links = document.getElementsByTagName('link');
  for(let i=0;i<links.length;i++){
    const link = links[i];
    if(link && link.getAttribute('href')&&link.getAttribute('href')===href) {
      link.parentNode.removeChild(link);
    }
  }
}

export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
}

export function getReadMinute(filename){
  return getReadTime(filename)?Math.ceil(getReadTime(filename) / 60):'0';
}

// 实现数据扁平化（将多级目录的数据转换为一级目录的数据）
export function flatten(array){
  return [].concat(...array.map(item=> [].concat(item,...flatten(item.subitems))))
}