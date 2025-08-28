import Image from 'next/image';
import Link from 'next/link';

export default function GoToNotion() {
  return (
    <div className="bg-black rounded-2xl text-white h-full flex flex-col justify-between shadow-[0_0_4px_0_rgba(0,0,0,0.1)] border-none">
      <div className="text-center h-full p-0 m-0">
        <h3 className="text-2xl font-extrabold pt-6 mb-6">
          클러버가 <br /> 궁금하시다면?
        </h3>

        {/* 노션 아이콘 */}
        <Link
          href={
            'https://polymorphismj.notion.site/Clubber-19cfbba268728049b974f28a3254bb17?source=copy_link'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center mb-6"
        >
          <div className="size-32 bg-white rounded-full flex items-center justify-center">
            <Image src="/images/main-notion.png" alt="notion" width={70} height={70} />
          </div>
        </Link>

        {/* SNS 섹션 */}
        <div className="flex justify-end">
          <div className="w-64 bg-white rounded-tl-3xl rounded-br-2xl p-2.5 border-none">
            <div className="flex items-center justify-center">
              <span className="text-md text-black font-semibold mr-3"># 클러버 SNS</span>

              {/* SNS 아이콘들 */}
              <div className="flex gap-2">
                <Link
                  href="https://www.instagram.com/clubber_ssu/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src="/images/main/instagram.png" alt="instagram" width={35} height={35} />
                </Link>
                <Link href="https://pf.kakao.com/_QiHDG" target="_blank" rel="noopener noreferrer">
                  <Image src="/images/main/kakaotalk.png" alt="kakao" width={35} height={35} />
                </Link>
                <Link href="mailto:ssuclubber@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Image src="/images/main/gmail.png" alt="mail" width={40} height={40} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
