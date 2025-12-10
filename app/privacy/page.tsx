'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-toss-grey-100 pb-safe">
            {/* Header */}
            <header className="bg-toss-grey-100 sticky top-0 z-50 px-5 py-4 flex items-center gap-4">
                <Link href="/settings" className="text-toss-grey-900 hover:text-toss-grey-600 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-[20px] font-bold text-toss-grey-900">개인정보 처리방침</h1>
            </header>

            <main className="max-w-md mx-auto px-5 pt-2 space-y-4">
                <section className="bg-white rounded-[24px] p-6 shadow-sm">
                    <h2 className="text-[17px] font-bold text-toss-grey-900 mb-2">1. 개인정보의 처리 목적</h2>
                    <p className="text-[15px] text-toss-grey-600 leading-relaxed">
                        '리마인드 보관소'는(은) 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                    </p>
                    <ul className="list-disc list-inside mt-2 text-[15px] text-toss-grey-600 space-y-1 ml-1">
                        <li>회원 가입 및 관리</li>
                        <li>서비스 제공 및 개선</li>
                        <li>링크 및 메모 데이터 저장 및 관리</li>
                    </ul>
                </section>

                <section className="bg-white rounded-[24px] p-6 shadow-sm">
                    <h2 className="text-[17px] font-bold text-toss-grey-900 mb-2">2. 개인정보의 처리 및 보유 기간</h2>
                    <p className="text-[15px] text-toss-grey-600 leading-relaxed">
                        ① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
                    </p>
                    <p className="text-[15px] text-toss-grey-600 leading-relaxed mt-2">
                        ② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
                    </p>
                    <ul className="list-disc list-inside mt-2 text-[15px] text-toss-grey-600 space-y-1 ml-1">
                        <li>회원 탈퇴 시까지</li>
                        <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
                    </ul>
                </section>

                <section className="bg-white rounded-[24px] p-6 shadow-sm">
                    <h2 className="text-[17px] font-bold text-toss-grey-900 mb-2">3. 정보주체의 권리·의무 및 그 행사방법</h2>
                    <p className="text-[15px] text-toss-grey-600 leading-relaxed">
                        이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
                    </p>
                    <ul className="list-disc list-inside mt-2 text-[15px] text-toss-grey-600 space-y-1 ml-1">
                        <li>개인정보 열람 요구</li>
                        <li>오류 등이 있을 경우 정정 요구</li>
                        <li>삭제 요구</li>
                        <li>처리정지 요구</li>
                    </ul>
                </section>

                <section className="bg-white rounded-[24px] p-6 shadow-sm">
                    <h2 className="text-[17px] font-bold text-toss-grey-900 mb-2">4. 처리하는 개인정보의 항목</h2>
                    <p className="text-[15px] text-toss-grey-600 leading-relaxed">
                        회사는 다음의 개인정보 항목을 처리하고 있습니다.
                    </p>
                    <ul className="list-disc list-inside mt-2 text-[15px] text-toss-grey-600 space-y-1 ml-1">
                        <li>필수항목: 이메일, 비밀번호 (소셜 로그인 시 해당 제공업체에서 제공하는 식별자)</li>
                        <li>선택항목: 프로필 이미지, 닉네임</li>
                    </ul>
                </section>

                <div className="text-center text-[13px] text-toss-grey-400 mt-8 pb-8">
                    공고일자: 2025년 12월 08일 / 시행일자: 2025년 12월 08일
                </div>
            </main>
        </div>
    )
}
