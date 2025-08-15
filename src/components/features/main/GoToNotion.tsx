import Image from 'next/image';
import Link from 'next/link';

export default function GoToNotion() {
  return (
    <div className="bg-black rounded-2xl text-white h-full flex flex-col justify-between">
      <div className="text-center">
        <h3 className="text-2xl font-extrabold pt-6 mb-6">
          클러버가 <br /> 궁금하시다면?
        </h3>

        {/* 노션 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="size-32 bg-white rounded-full flex items-center justify-center">
            <Image src="/images/main-notion.png" alt="notion" width={70} height={70} />
          </div>
        </div>

        {/* SNS 섹션 */}
        <div className="flex justify-end">
          <div className="w-64 bg-white rounded-tl-3xl p-2.5 pb-2">
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
