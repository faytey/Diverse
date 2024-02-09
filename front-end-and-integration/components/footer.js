export default function Footer () {
    return (
        <div>
             <div className='grid lg:grid-cols-3 grid-cols-1 gap-8 mb-[0.5cm]'>
    <div className='grid-cols-1'>
    <img src="images/logo.png" className='m-[auto]' width="200" />
    </div>
    <div className='grid-cols-1 m-[auto]'>
      <div className='text-[#fff] text-[120%] mb-[0.2cm]'>
        <img src="images/mail.png" width="30" style={{display:"inline-block"}} />
        <span className='ml-[0.3cm]'>Subscribe to our newsletter to get latest Diverse ecosystem updates</span>
      </div>
      <form>
      <input type="email" className="outline-none w-[100%] placeholder-[#555] text-[#000] p-[0.3cm] rounded-md" placeholder='Please input your email address' />
      <button type="submit" className="px-[0.4cm] py-[0.2cm] bg-[#020] w-[100%] mt-[0.3cm] secondbutton text-[#fff] rounded-md">Subscribe</button>
      </form>
    </div>
    <div className='grid-cols-1 m-[auto]'>
      <div className='text-[120%] text-[#fff] mb-[0.2cm] font-[500]'>Join us on social media</div>
      <img src="images/telegram.png" width="40" className='m-[0.2cm]' style={{display:"inline-block"}} />
      <img src="images/twitter.png" width="40" className='m-[0.2cm]' style={{display:"inline-block"}} />
      <img src="images/linkedin.png" width="40" className='m-[0.2cm]' style={{display:"inline-block"}} />
      <img src="images/youtube.png" width="40" className='m-[0.2cm]' style={{display:"inline-block"}} />
      <img src="images/discord.png" width="40" className='m-[0.2cm]' style={{display:"inline-block"}} />
    </div>
    </div>
    <div className='mb-[1cm]' style={{borderBottom:"1px solid #fff"}}></div>
    <div className='text-center'>
        <div className='text-[#fff] text-[120%] mb-[0.2cm]'>
          <span><span className="font-[500]">Diverse</span> - The most efficient swap and integration platform on StarkNet</span>
          <img src="images/starknet.png" width="30" className='ml-[0.3cm]' style={{display:"inline-block"}} />
        </div>
       <div className='text-[150%] text-[#fff]'>Copyright &copy; {new Date().getFullYear()}</div>
       </div>
        </div>
    )
}