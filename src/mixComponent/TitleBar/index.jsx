import './index.less';

export default function TitleBar({ mainText, subText, styles } = props) {
    return (
        <div className="title-bar">
            {mainText && <h3 className="main-title" style={{ color: styles.titleColor }} >{mainText}</h3>}
            {subText && <p className="sub-title">{subText}</p>}
        </div>
    );
}