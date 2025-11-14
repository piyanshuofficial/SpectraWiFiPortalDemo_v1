// src/components/FooterBar.js

import React, { useState } from 'react';
import '@components/FooterBar.css';
import PolicyModal from '@components/PolicyModal';
import bgImage from '@assets/images/banner-element.png';

const PRIVACY_POLICY_HTML = (
  <div>
    <h2 style={{ fontWeight: "bold", textDecoration: "underline" }}>Corporate Restructuring</h2>
    <p>
      On happening of any merger, demerger or other forms of Corporate Restructuring, as the case may be, we may have to share your personal information with our potential business partner or Investor or Acquirer or Acquiree to continue to provide the services.
    </p>

    <h2 style={{ fontWeight: "bold" }}>Consent</h2>
    <ul>
      <li>
        You have expressly consented to use of your personal information by us including our associates and partners in the manner detailed herein by your action by registering or using our Portal, which you are advised to do after reading and consenting to agree with the terms only;
      </li>
      <li>
        We use third party payment gateways for monetary transactions and they may collect certain details for processing your financial transactions to identification and verification purpose. We hereby clarify that we do not collect your banking or credit card details in any manner whatsoever and we do not take any responsibility for the data shared by you with the Payment Service Provider;
      </li>
      <li>
        You hereby consent to use of your contact details for reaching out to you for business/promotional purpose by us or our affiliates;
      </li>
      <li>
        When you sign up with us for an online account, register to receive marketing communications from us, fill in one of our forms (whether online or offline) or otherwise expressly provide us with your personal data, we may collect and store any personal data that you provide to us and may use it to personalize and improve your experience on our digital platforms, provide products and services you request from us, and carry out profiling and market research.
      </li>
      <li>
        You hereby consent to security checks for verification and Identification purposes whether by us or through third party service providers.
      </li>
    </ul>

    <h2 style={{ fontWeight: "bold", textDecoration: "underline" }}>Data Security and Confidentiality</h2>
    <ul>
      <li>We use adequate security measures including SSL certification for protection of your data and maintaining its confidentiality.</li>
      <li>We comply with ISO 27001 standards to keep your data safe and secure.</li>
      <li>We take reasonable measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, no method of data transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</li>
    </ul>

    <p>
      Shyam Spectra Private Limited (hereinafter referred to as "Company/we/us/our"), which also includes its affiliates, associates and partners) is the author and publisher of the internet resource spectra.co "Portal" including website, sub-domains, and microsites) as well as the software and applications or other platforms provided by us, including but not limited to the mobile application 'SpectraOne' (together with the Portal, referred to as the "Services").
    </p>
    <p>
      This privacy policy ("Privacy Policy") explains how we collect, use, share, disclose and protect the Personal information of the Users, including the Users (referred to as "you", "your" or "Users" in this Privacy Policy.
    </p>
    <p>
      We created this Privacy Policy to demonstrate our commitment to the protection of your privacy and your personal information. Your use of and access to the Services is subject to this Privacy Policy and our Terms of Use. Any term used but not defined in this Privacy Policy shall have the meaning attributed to it in our Terms of Use.
    </p>
    <p>
      If you do not consent to our usage of your personal information, please refrain from using the services. Please take note that you are well within your rights to not provide us with certain information, withdraw your consent for collection/use of your personal information, or request for temporary suspension or permanent deletion of certain information though we hereby advise you that this may cause you to not be able to avail full access/use of the services and will also mean that we may exercise our right to refrain from providing our services to you. We will not be liable/responsible for any breach of privacy owing to User's negligence.
    </p>
    <p>
      By using the services or by otherwise providing us with your information, you will be deemed to have read, understood, and agreed to the practices and policies outlined in this Privacy Policy and agree to be bound by the Privacy Policy. You hereby consent to our use, sharing, and disclosure of your information as described in this Privacy Policy concerning Your uses of any of our products and/or services. If You use the services on behalf of someone else or an entity (such as your employer), you represent that you are authorized by such individual or entity to (i) accept this Privacy Policy on such individual's or entity's behalf, and (ii) consent on behalf of such individual or entity to our collection, use and disclosure of such individual's or entity's information as described in this Privacy Policy.
    </p>
    
    <h3 style={{ textDecoration: "underline" }}>Collection of Personal Information and Use</h3>
    <h4 style={{ fontWeight: "bold" }}>Personal Information:</h4>
    <p>
      The personal information we collect includes but is not limited to information such as your name, father's name, mother's name, spouse's name, age, date of birth, mailing address, billing address, telephone numbers, email addresses, PAN Card details and other information such as Office address, Installation address. Our servers may collect your Internet Protocol address (IP address, your computer's operating system, name of the domain you used to access the Internet, the website you came from and the website you visit next, Financial information (such as credit card or bank account numbers) in connection with a transaction, which we do not collect or store at our Website as we are using a payment gateway service provider.
    </p>
    <p>
      We also use Information given by You for using Our Services by signing Consumer Acquisition Form (CAF) and Know-Your-Customer Documents (KYC) provided by You. In addition to Your information provided in CAF and KYC documents, we may also collect certain information automatically through software/other means. For example, we may collect:
    </p>
    <h4 style={{ fontWeight: "bold" }}>Device information :</h4>
    <p>
      such as Your hardware model, IMEI number and other unique device identifiers, MAC address, IP address, operating system version, and settings of the device You use to access the Services.
    </p>
    <h4 style={{ fontWeight: "bold" }}>Login information :</h4>
    <p>
      such as the time and duration of Your use of our Product, search query terms You enter through the Product, and any other information.
    </p>
    <h4 style={{ fontWeight: "bold" }}>Location information :</h4>
    <p>
      such as Your device's GPS signal or information about nearby Wi-Fi access points and cell towers that may be transmitted to us when You use certain Services.
    </p>
    <h4 style={{ fontWeight: "bold" }}>Other information :</h4>
    <p>
      about Your use of the Services, such as the app You use, the website You visit, and how You interact with content offered through a Service.
    </p>
    <p>
      You are hereby informed, we never collect Sensitive Personal Information ("SPI") as defined under the provisions of Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules, 2011]. Please take note that we will not use your SPI or disclose such SPI to any third party except for any financial information that you choose to provide while making payment for any Services on the Portal or as written under this policy. We hereby clarify that we do not collect your banking or credit card details in any manner whatsoever and we do not take any responsibility for the data shared by you with the Payment Service Provider;
    </p>
    <p>
      We will collect and store each User's personal information to provide you with relevant information at the time of the next visit and facilitate you in keeping track of Services availed by you.
    </p>
    <h3 style={{ textDecoration: "underline" }}>Use of Personal Information :</h3>
    <ul>
      <li>We may use the information submitted by you to send your promotional messages or emails or notifications for administrative purposes. You can also manage your communication preferences and opt out of promotional emails.</li>
      <li>We use the referral information shared by you to contact the referred persons and you will be eligible for referral awards in accordance with our referral programs, if any;</li>
      <li>We may use software or other programs to track Portal usage, and community member's behaviour and gather statistics for our business purposes;</li>
      <li>We take reasonable measures to protect your information from unauthorized access, disclosure, alteration, or destruction. You understand that data shared with us is subject to security risks despite our best efforts to safeguard the data;</li>
      <li>Your SpectraOne Account is secured by your login id & password, and we advise you to keep them secure. It is your responsibility to protect your login information and in case you fail to do so, you are liable for the consequences of your action. We advise you to refrain from disclosing your login details to anyone. You are requested to contact us immediately if you have reason to suspect any breach of security including compromise of your login information;</li>
      <li>Our Site including Applications may contain links to third party websites. Such third party websites are governed by their own terms of use and privacy policy. We advise you to read the Terms of Use or Privacy Policy of such Websites before accessing their services or submitting your personal details.</li>
      <li>We have a policy of not sharing Your Personal Information with any third parties except our affiliates, advertisers and partners. We reserve the right to use your information and display the name, user id and state from where you are participating while disclosing/advertising the result of any content on our Portal;</li>
      <li>We may use your personal information for legal or administrative authority to meet our legal obligations or for data analysis, and government requests or to enforce terms of service.</li>
      <li>We may keep records of electronic communications and telephone calls received and made for making appointments or other purposes for the purpose of administration of Services, customer support, research and development. This analysis helps us improve our services and tailor them to user needs.</li>
      <li>You represent to us that you are above the age of 18 and are in a contracting capacity to access our platform and share your personal information with us. Any misrepresentation to that effect, shall authorize us to take relevant steps to stop provision of the Services and any other actions in accordance with the law. You shall always be liable for any consequences due to misrepresentation and shall indemnify the Company, its Directors accordingly.</li>
      <li>Please note, if you don't choose to provide us with the requested data, we will be unable to offer you our products or services.</li>
    </ul>
    <h3 style={{ fontWeight: "bold", textDecoration: "underline" }}>Treatment of Personal Information:</h3>
    <ul>
      <li>We respect your confidentiality and keep all the Personal Information secure and we wish to assure you that we will not share, distribute, trade, sell or rent your Personal Information to any third party without your consent;</li>
      <li>Our use of your personal information will be restricted for the purposes enumerated in this Privacy Policy read with Terms of Use;</li>
      <li>We use cookies and when you visit our Site, cookies may be left in your computer to enable us to track your usage and customize the content displayed to you to suit your behavior;</li>
      <li>We also use cookies for authentication, Portal management and security purposes;</li>
      <li>We have a detailed Cookie Policy which is displayed at <a href="https://home.spectra.co/cookie-policy" target="_blank" rel="noreferrer">https://home.spectra.co/cookie-policy</a>.</li>
      <li>We use appropriate security measures to safeguard your information and to protect against unauthorized access to and unlawful interception of Personal Information. However, no internet site can fully eliminate security risks;</li>
      <li>We do not make your e-mail addresses available to any third party. We do not trade or sell your Personal Information in any manner, except as enumerated herein; and</li>
      <li>We may disclose aggregated information about the use of the Site, but it will never contain Personal Information. We do not disclose Personal Information to third parties in the normal course of operations, except in situations where we are legally obligated to disclose information to the government or other third parties,</li>
    </ul>
    <h3 style={{ fontWeight: "bold", textDecoration: "underline" }}>PROHIBITED ACTIONS</h3>
    <p>
      While visiting or using our application or digital platform, you agree not to, by any means (including hacking, cracking or defacing any portion of the website/applications/portals/platforms) indulge in illegal or unauthorized activities including the following:
    </p>
    <ol>
      <li>Restrict or inhibit any authorized user from using an application or digital platform.</li>
      <li>Use the application or digital platform for unlawful purposes.</li>
      <li>Harvest or collect information about an application or digital platform's users without their express consent.</li>
      <li>"Frame" or "mirror" any part of the application or digital platform without our prior authorization.</li>
      <li>Engage in spamming or flooding.</li>
      <li>Transmit any software or other materials that contain any virus, or other harmful or disruptive component.</li>
      <li>
        Use any device, application, or process to retrieve, index, "data mine" or in any way reproduce or circumvent the navigational structure or presentation of the application or digital platform.
      </li>
      <li>
        Permit or help anyone without access to the application or digital platform to use the application or digital platform through your username and password or otherwise.
      </li>
    </ol>
    <p>
      You shall always be liable for any consequences due to illegal or unauthorized activities and shall indemnify the Company, its Directors accordingly.
    </p>
    <h3 style={{ fontWeight: "bold", textDecoration: "underline" }}>Changes to Policy</h3>
    <ul>
      <li>
        We reserve the right to change, modify, add or delete portions of the terms of this privacy policy, at our sole discretion from time to time. We encourage you to review the Privacy Policy periodically for any changes and Your continued use of the App after changes indicate your acceptance of the updated Privacy Policy.
      </li>
      <li>
        We will notify about changes either through a notice/banner displayed on our Portal or by sending you an email about the new policy. You have the right to refuse to continue with us if you do not like any of the changes.
      </li>
    </ul>
    <h3 style={{ fontWeight: "bold", textDecoration: "underline" }}>Applicable Law and Jurisdiction:</h3>
    <ul>
      <li>You hereby give your consent for applicability of the jurisdiction of Indian Laws applicable to the state of New Delhi and jurisdiction of New Delhi Courts.</li>
      <li>All disputes/issues relating to this policy shall be resolved in accordance with our Terms of Use.</li>
    </ul>
    <h3 style={{ fontWeight: "bold", textDecoration: "underline" }}>Grievance Officer and its Contact:</h3>
    <ul>
      <li>
        We have appointed a grievance officer to look after your queries and grievances if any, who can be reached <a href="mailto:appeal@spectra.co">appeal@spectra.co</a>.
      </li>
      <li>
        We are committed to safeguarding your personal information collected and handled by us and look forward to your continued support for the same. In case of any feedback or concern regarding protection of your personal information, you can contact us at <a href="mailto:support@spectra.co">support@spectra.co</a>
      </li>
      <li>
        We will do our best to respond promptly and in any event within one month of the following:
        <ul>
          <li>Receipt of your request;</li>
          <li>You can also ask for temporary suspension of your account.</li>
          <li>We will act on your request and will do the needful after verifying that such request was made by you only and not by any unauthorized person.</li>
        </ul>
        Further to assist us in dealing with your request, please provide your full name, address, email address, mobile no. and some document for identification.
      </li>
    </ul>
    <h4 style={{ fontWeight: "bold" }}>Registered office address :</h4>
    <p style={{ fontWeight: "bold" }}>
      A-60, Naraina Industrial Area,<br />
      Phase-1, New Delhi -110028
    </p>
  </div>
);

const TERMS_HTML = (
  <div>
    <h3>YOU MUST READ THE FOLLOWING TERMS OF USE, WHICH CONTAINS THE TERMS FOR USING THE APPLICATION INCLUDING WEBSITE AND YOUR CONTINUED BROWSING OR USE OF THE WEBSITE SHALL MEAN THAT YOU HAVE AGREED TO ABIDE BY THIS TERMS OF USE
</h3><br></br>
  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>INTRODUCTION:</span>
  </h2>
  <p>
    Welcome to Spectra, a brand by <strong>SHYAM SPECTRA PRIVATE LIMITED</strong>, a company registered in India under the provisions of Companies Act, 1956. Spectra is the flagship brand of M/s <strong>SHYAM SPECTRA PRIVATE LIMITED</strong> under which we operate a platform under the name and style of Spectra, which contains the website and its sub-pages, mobile/other applications as well as our partner websites/mobile applications (hereinafter referred to as “Portal” or “Platform”) through which we run and manage a community of users who are using Our services. The term “Spectra” shall mean and include individual/collective reference to one/all offerings on our Portal.
  </p>
  <p>
    This Terms of Use (“Agreement” or “TOU”) lays down the terms and conditions for use/access of our Portal and anyone who accesses our Portal has implied consent by continued use/access of our Portal. It forms a binding agreement between you and our Company M/s. <strong>SHYAM SPECTRA PRIVATE LIMITED</strong>). By using Our Portal i.e. mobile application, website or any of our Services, you are agreeing to these terms, as well as our Privacy Policy (published under Spectra Portal) incorporated hereby for your reference, and all of these terms will govern your use of our Portal i.e. mobile application, site and our Services. If you do not agree to these terms, you must cease use of the mobile application, site and our Services. The term “you” refers to the person accessing or using the mobile application, site or our Services, or the company or organization on whose behalf that person accesses the mobile application, site or our Services.
  </p>
  <p>
    <strong>Applicability of TOU :</strong> TOU constitutes a legal agreement between the licensee (YOU or YOUR) and Spectra. For all practical reasons in this TOU, the term “Product” will refer to Spectra Product and/or Service offered through the Portal or otherwise including but not limited to Mobile/Other Applications. Please read this TOU carefully before using our Product as it contains important information and constitutes a binding legal agreement between you and Spectra. Your use of Product is also subject to our privacy policy as documented in this TOU. By downloading or using our Product/Services, you agree to comply with the TOU. If you do not agree, you may not download or use the Portal. Spectra may modify this TOU from time to time with or without any prior notice to you. We recommend that you keep checking the Terms of Use from time to time to keep yourself abreast of changes in the Terms of use, if any. If you continue to access or use Product after such modification, you will be deemed to have read, understood, and unconditionally agreed to the modification.
  </p>
  <p>
  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>DEFINITIONS:</span>
  </h2>
  <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
    <li>
      <strong>a. Affiliates</strong> shall mean and include our social media Pages/ Marketing Pages/ our Partners/ Affiliates/ Licensors/ Associates and peripherals along with their respective employees, and authorized agents who work with us at Spectra.
    </li>
    <li>
      <strong>b. Applicable Law</strong> shall mean and include but not limited to the rules, regulations, guidelines and clarifications framed there under, including the (Indian) Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Information) Rules, 2011 (the “SPI Rules”), and the (Indian) Information Technology (Intermediaries Guidelines) Rules, 2011 (the “IG Rules”), the Indian Contract Act, 1872 & the (Indian) Information Technology Act, 2000 and other relevant Laws of India.
    </li>
    <li>
      <strong>c. Business Area/Territory</strong> shall mean all the areas where we provide our services i.e., in INDIA
    </li>
    <li>
      <strong>d. Company/Us/We/Our</strong> shall mean Shyam Spectra Private Limited (along with social media Pages/ Marketing Pages/ Partners/ Legal Team and peripherals along with its employees and authorized agents). Anyone who wishes to enjoy/access/use/participate in any of the services to use the Portal according to these Terms and Conditions and who registers with us will be referred to in these Terms and Conditions.
    </li>
    <li>
      <strong>e. IPR</strong> shall mean and include Copyrights, Trademarks, Patents or any other rights of Company in the Product, its contents or Mobile/Other Applications.
    </li>
    <li>
      <strong>f. The Portal</strong> or any part of it will include but not be limited to the Data/information of All the Users and Affiliates of the Portal.
    </li>
    <li>
      <strong>g. Services</strong> shall mean all sorts of Services and their parts provided by us offered to the Users whether registered or not.
    </li>
    <li>
      <strong>h. Spectra</strong> shall mean brand name of the Company.
    </li>
    <li>
      <strong>i. Terms and Conditions</strong>: The Terms of Conditions which are mentioned below.
    </li>
    <li>
      <strong>j. Transmit</strong> shall mean all forms of communication including but not limited to publishing/ posting/ SMS/ uploads/ e-mails/ distribute/ disseminate.
    </li>
    <li>
      <strong>k. User Account</strong> shall mean a personal account of the user which is operated and managed by the user.
    </li>
    <li>
      <strong>l. User/You</strong> shall mean and include Anyone who wishes to enjoy/ access/ use/ participate in any of the services to use the Portal according to these Terms and Conditions and who register with us will be referred to in these Terms and Conditions.
    </li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>USE OF THE PORTAL/ SERVICES:</span>
  </h2>
  <ul>
    <li>Any person who uses/accesses or downloads our Portal/Products is referred to as "User" or "you." Users can use/access our Portal subject to this TOU along with the Privacy/other Policy, can access our Services, after mandatory registration on the Portal, which may be followed by creating your profile on the portal itself and payment, if any.</li>
    <li>Usage/Access/Participation/Registration of Service or any part of it on the Portal by the User(s) shall be deemed to have read/understood/accepted/agreed to the TOU. Any promotions on the portal organized/conducted by Us shall be governed by independent/supplementary/additional Terms & Condition concerned with the respective service while being in sync with this TOU.</li>
    <li>Rights to alter/update/remove the Terms or any part of the TOU along with the independent/additional Terms & Condition are at all times reserved with Us. No prior notification of any such modification will be necessary unless it deems fit to us. All such modifications will become effective at the very instant it is Posted/Published on the Portal and will be deemed as read/accepted by the user at the same instant for future usage, post such instant. By using the Portal and the Service means and is interpreted as the user having visits/checked on the Terms regularly from time to time to be familiar with such terms, we do/will not hold any responsibility of consequences of any ignorance on the part of the User regarding the above-mentioned modifications or updates to the Portal. Still if at any time/situation it seems fit to us, we may provide notifications and choice of acceptance or non-acceptance of such modification prior to usage of the portal or any part of it through available media/contact detail.</li>
    <li>In the scenario where any part of the TOU is held/becomes unlawful/invalid/void/unenforceable by onset or implication of new laws or amendment of existing laws or for any reason by any judicial or quasi-judicial body in India, such effect will only adhere to that specific part of the TOU in these Terms independently, hence remaining part will not be affected, so the validity and enforceability of the remaining Terms stays intact.</li>
    <li>You understand/agree to the fact that any statistics generated prior to/during/as the conclusion of any service on/of the Portal are neither transferable between users nor can be extracted/used in any form outside the Portal and you are legally obliged to refrain from doing so.</li>
    <li>You hereby grant your consent for receiving communications such as announcements, administrative messages, and advertisements from Spectra or any of its partners, licensors, or associates.</li>
    <li>If We, in Our sole discretion, determine that any User is using the Portal or Service in a manner that is inconsistent with these Terms, we reserve the right to terminate the User's right to use the Portal, temporarily or permanently. Our decision on such matters will be final and binding on the User.</li>
    <li>We may at Our sole discretion:
      <ul>
        <li>Restrict, suspend, or terminate any User's access to all or any part of Portal;</li>
        <li>Change, suspend, or discontinue all or any part of our services;</li>
        <li>Reject, move, or remove any material that may be submitted by a User;</li>
        <li>Move or remove any content that is available on Spectra Platform;</li>
        <li>Deactivate or delete a User's account and all related information and files on the account;</li>
        <li>Establish general practices and limits concerning the use of our Portal.</li>
      </ul>
    </li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>CONDITION OF USE:</span>
  </h2>
  <p>
    You must be 18 years of age or older to register, use the Services, or visit or use the Website in any manner. By registering, visiting and using the Website or accepting this TOU, you represent and warrant to Spectra that you are 18 years of age or older, and that you have the right, authority and capacity to use the Website and the Services available through the Website, and agree to and abide by this TOU.
  </p>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>TERMS OF USE:</span>
  </h2>
  <h3>USER ACCOUNT AND DATA PRIVACY</h3>
  <ul>
    <li>The information collected from you will be dealt in the manner enumerated in our Privacy Policy. Privacy Policy can be read at Spectra website.</li>
  </ul>

  <h3>LISTING CONTENT AND DISSEMINATING INFORMATION</h3>
  <ul>
    <li>
      The Services provided by Spectra or any of its licensors or service providers are provided on an "as is" and “as available’ basis, and without any warranties or conditions (express or implied, including the implied warranties of merchantability, accuracy, fitness for a particular purpose, title and non-infringement, arising by statute or otherwise in law or from a course of dealing or usage or trade). Spectra does not provide or make any representation, warranty or guarantee, express or implied about the Website or the Services. Spectra does not guarantee the accuracy or completeness of any content or information provided by Users on the Website. To the fullest extent permitted by law, Spectra disclaims all liability arising out of the User’s use or reliance upon the Website, the Services, representations and warranties made by other Users, the content or information provided by the Users on the Website, or any opinion or suggestion given or expressed by Spectra or any User in relation to any User or services provided by such User.
    </li>
    <li>
      The Website may be linked to the website of third parties, affiliates and business partners. Spectra has no control over, and is not liable or responsible for content, accuracy, validity, reliability, quality of such websites or made available by/through our Portal. Inclusion of any link on the Website does not imply that Spectra endorses the linked site. User may use the links and these services at User’s own risk.
    </li>
    <li>
      Spectra assumes no responsibility, and shall not be liable for, any damages to, or viruses that may infect User’s equipment on account of User’s access to, use of, or browsing the Website or the downloading of any material, data, text, images, video content, or audio content from the Website. If a User is dissatisfied with the Website, User’s sole remedy is to discontinue using the Website.
    </li>
    <li>
      If Spectra determines that you have provided fraudulent, inaccurate, or incomplete information, including through feedback, Spectra reserves the right to immediately suspend your access to the Website or any of your accounts with Spectra and makes such declaration on the website as determined by Spectra for the protection of its business and in the interests of Users. You shall be liable to indemnify Spectra for any losses incurred as a result of User misrepresentations or fraudulent feedback that has adversely affected Spectra or its Users.
    </li>
  </ul>

  <h3>PROFILE OWNERSHIP AND EDITING RIGHTS</h3>
  <ul>
    <li>
      Spectra ensures easy access to you by providing a tool to update your profile information. Spectra reserves the right of ownership of all the User profile and photographs and to moderate the changes or updates requested by User. However, Spectra takes the independent decision whether to publish or reject the requests submitted for the respective changes or updates. You hereby represent and warrant that you are fully entitled under law to upload all content uploaded by you as part of your profile or otherwise while using Spectra’s services, and that no such content breaches any third-party rights, including intellectual property rights. Upon becoming aware of a breach of the foregoing representation, Spectra may modify or delete parts of your profile information at its sole discretion with or without notice to you.
    </li>
  </ul>
  </p>
  
  <h3 style={{ fontWeight: "bold", marginTop: "2em" }}>USAGE IN PROMOTIONAL & MARKETING MATERIALS</h3>
  <ul>
    <li>
      In recognition of the various offerings and services provided by Spectra to User, User shall (subject to its reasonable right to review and approve):
      <ul>
        <li>
          (a) allow Spectra to include a brief description of the services provided to User in Spectra’s marketing, promotional and advertising materials;
        </li>
        <li>
          (b) allow Spectra to make reference to User in case studies, and related marketing materials;
        </li>
        <li>
          (c) serve as a reference to Spectra’s existing and potential clients;
        </li>
        <li>
          (d) provide video logs, testimonials, e-mailers, banners, interviews to the news media and provide quotes for press releases;
        </li>
        <li>
          (e) make presentations at conferences;
        </li>
        <li>
          (f) use the User’s name and images etc., within product literature, e-mailers, press releases, social media and other advertising, marketing and promotional materials.
        </li>
      </ul>
    </li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>RIGHTS AND OBLIGATIONS RELATING TO CONTENT:</span>
  </h2>
  <p>
    Spectra hereby informs Users that they are not permitted to host, display, upload, modify, publish, transmit, update or share any information that:
  </p>
  <ul>
    <li>belongs to another person and to which the User does not have any right to;</li>
    <li>is grossly harmful, harassing, blasphemous, defamatory, obscene, pornographic, pedophilic, libelous, invasive of another's privacy, hateful, or racially, ethnically objectionable, disparaging, or otherwise unlawful in any manner whatever;</li>
    <li>harm minors in any way;</li>
    <li>infringes any patent, trademark, copyright or other proprietary rights;</li>
    <li>violates any law for the time being in force;</li>
    <li>deceives or misleads the addressee about the origin of such messages or communicates any information which is grossly offensive or menacing in nature;</li>
    <li>impersonate another person;</li>
    <li>contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer resource;</li>
    <li>threatens the unity, integrity, defense, security or sovereignty of India, friendly relations with foreign states, or public order or causes incitement to the commission of any cognizable offence or prevents investigation of any offence or is insulting any other nation.</li>
  </ul>
  <p style={{ marginTop: "2em" }}>Users are also prohibited from:</p>
  <ul>
    <li>violating or attempting to violate the integrity or security of the Website or any Spectra Content;</li>
    <li>transmitting any information (including job posts, messages and hyperlinks) on or through the Website that is disruptive or competitive to the provision of Services by Spectra;</li>
    <li>intentionally submitting on the Website any incomplete, false or inaccurate information;</li>
    <li>making any unsolicited communications to other Users;</li>
    <li>using any engine, software, tool, agent or other device or mechanism (such as spiders, robots, avatars or intelligent agents) to navigate or search the Website;</li>
    <li>attempting to decipher, decompile, disassemble or reverse engineer any part of the Website;</li>
    <li>copying or duplicating in any manner any of the Spectra Content or other information available from the Website;</li>
    <li>framing or hot linking or deep linking any Spectra Content.</li>
    <li>circumventing or disabling any digital rights management, usage rules, or other security features of the Software.</li>
  </ul>
  <p>
    Spectra, upon obtaining knowledge by itself or been brought to actual knowledge by an affected person in writing or through email signed with electronic signature about any such information as mentioned above, shall be entitled to disable such information that is in contravention of Applicable law. Spectra shall also be entitled to preserve such information and associated records for at least 90 (ninety) days for production to governmental authorities for investigation purposes.
  </p>
  <p>
    In case of non-compliance with any applicable laws, rules or regulations, or the TOU (including the Privacy Policy) by a User, Spectra has the right to immediately terminate the access or usage rights of the User to the Website and Services and to remove non-compliant information from the Website.
  </p>
  <p>
    Spectra may disclose or transfer User-generated information to its affiliates or governmental authorities in such manner as permitted or required by applicable law, and you hereby consent to such transfer.
  </p>
  <p>
    Spectra respects the intellectual property rights of others and we do not hold any responsibility for any violations of any intellectual property rights.
  </p>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>TERMINATION :</span>
  </h2>
  <p>
    Spectra reserves the right to suspend or terminate a User’s access to the Website and the Services with or without notice and to exercise any other remedy available under law, in cases where;
  </p>
  <ul>
    <li>Such User breaches any terms and conditions of the TOU;</li>
    <li>A third-party reports violation of any of its right as a result of your use of the Services;</li>
    <li>Spectra is unable to verify or authenticate any information provide to Spectra by a User;</li>
    <li>Spectra has reasonable grounds for suspecting any illegal, fraudulent or abusive activity on part of such User; or</li>
    <li>Spectra believes in its sole discretion that User’s actions may cause legal liability for such User, other Users or for Spectra or are contrary to the interests of the Website.</li>
  </ul>
  <p>
    Once temporarily suspended, indefinitely suspended or terminated, the User may not continue to use the portal under the same account, a different account or re-register under a new account. On termination of an account due to the reasons mentioned herein, such User shall no longer have access to data, messages, files and other material kept on the Website by such User. The User shall ensure that he/she/it has continuous backup of any services the User has availed in order to comply with the User’s record keeping process and practices.
  </p>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>LIMITATION OF LIABILITY:</span>
  </h2>
  <p>
    In no event, including but not limited to negligence, shall Spectra, or any of its directors, officers, employees, agents or content or service providers (collectively, the “Protected Entities”) be liable for any direct, indirect, special, incidental, consequential, exemplary or punitive damages arising from, or directly or indirectly related to, the use of, or the inability to use, the Website or the content, materials and functions related thereto, the Services, User’s provision of information via the Website, lost business, even if such Protected Entity has been advised of the possibility of such damages. In no event shall the Protected Entities be liable for :
  </p>
  <ul>
    <li>provision of or failure to provide all or any service by Users contacted or managed through the Website;</li>
    <li>any content posted, transmitted, exchanged or received by or on behalf of any User or other person on or through the Website;</li>
    <li>any unauthorized access to or alteration of your transmissions or data; or</li>
    <li>any other matter relating to the Website or the Service.</li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>RETENTION AND REMOVAL:</span>
  </h2>
  <p>
    Spectra may retain such information collected from Users from its Website or Services for as long as necessary, depending on the type of information; purpose, means and modes of usage of such information. Computer web server logs may be preserved as long as administratively necessary.
  </p>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>APPLICABLE LAW AND DISPUTE SETTLEMENT:</span>
  </h2>
  <ul>
    <li>You agree that this TOU and any contractual obligation between Spectra and User will be governed by the laws of India.</li>
    <li>Subject to the above, the courts at New Delhi shall have exclusive jurisdiction over any disputes arising out of or in relation to this TOU, your use of the Website or the Services or the information to which it gives access.</li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>CONTACT INFORMATION GRIEVANCE OFFICER:</span>
  </h2>
  <ul>
    <li>
      If a User has any questions concerning Spectra, the Website, this TOU, the Services, or anything related to any of the foregoing, Spectra customer support can be reached at the following email address:
      <a href="mailto:support@spectra.co" style={{ marginLeft: "6px" }}>support@spectra.co</a>
      via the contact information available.
    </li>
    <li>
      In accordance with the Information Technology Act, 2000, and the rules made there under, if you have any grievance with respect to the Website or the service, including any discrepancies and grievances with respect to processing of information, you can contact our Grievance Officer.
    </li>
    <li>
      In the event you suffer as a result of access or usage of our Portal by any person in violation Applicable Rules, please address your grievance to the above person.
    </li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>WAIVER :</span>
  </h2>
  <p>
    No provision of this TOU shall be deemed to be waived and no breach excused, unless such waiver or consent shall be in writing and signed by Spectra. Any consent by Spectra to, or a waiver by Spectra of any breach by you, whether expressed or implied, shall not constitute consent to, waiver of, or excuse for any other different or subsequent breach.
  </p>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>SERVICE DISRUPTION :</span>
  </h2>
  <ul>
    <li>We do not take any responsibility for Internet connectivity or other disruption in your hardware or software as these are factors beyond our control.</li>
    <li>You understand that we have no control over those disruptions and you take full responsibility for any loss due to service disruption for the above reasons.</li>
    <li>Spectra shall not be responsible for any interruption in the provision of the Contests, including, but not limited to disconnection or communication interferences due to issues in the internet infrastructure used for providing or accessing the services. You understand that Spectra has no control over these factors. You take full responsibility for any risk of loss due to such interruptions for any such reason.</li>
    <li>Spectra reserves the right to abandon any specific service or adjust the deadline of a service in certain specific/uncertain scenarios/which are beyond our reasonable control.</li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>COMPLAINTS AND DISPUTES :</span>
  </h2>
  <ul>
    <li>We appreciate your feedback and recommend you to lodge all complaints with our dedicated support team. All complaints will be entertained within reasonable time.</li>
    <li>You may contact us via Our Contact us page to notify us of any grievances or concerns that you may have in relation to Our Platform or Contests or to otherwise provide us with appropriate feedback concerning the same. We may seek additional information concerning your grievance or feedback, but any such communication from us shall not be construed as making a commitment, representation, or warranty to review/respond to or redress any grievance or feedback provided. You shall not claim or demand any royalty or fees from us in case we make any changes or update Our Platform or Contests pursuant to your feedback.</li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>MODIFICATION :</span>
  </h2>
  <p>
    We at Spectra endeavour to enable our users best in class environment and service conditions. We are subject to a changing economic/legal environment and hence we may change our Terms of Use and other policies from time to time. You are requested to keep yourself updated with changes and modifications.
  </p>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>DISCLAIMER :</span>
  </h2>
  <ul>
    <li>
      We have endeavoured to ensure that all the information on the Website is correct, but we neither warrant nor make any representations regarding the quality, accuracy or completeness of any data, information, product or Service. In no event shall we be liable for any direct, indirect, punitive, incidental, special, consequential damages or any other damages. Neither shall we be responsible for the delay or inability to use the Website or related Functionalities, the provision of or failure to provide Functionalities, or for any information, software, products, Functionalities and related graphics obtained through the Website, or otherwise arising out of the use of the website, whether based on contract, tort, negligence, strict liability or otherwise. Further, we shall not be held responsible for non-availability of the Website during periodic maintenance operations or any unplanned suspension of access to the website that may occur due to technical reasons or for any reason beyond our control. The user understands and agrees that any facility/functionality of the Site and their usage done entirely at their own discretion and risk and they will be solely responsible for any unauthorized usage or system failure whether or not due to failure of their Hardware or Systems beyond our control.
    </li>
    <li>
      You agree to indemnify, defend and hold harmless Spectra from and against any and all losses, liabilities, claims, damages, costs and expenses (including legal fees and disbursements in connection therewith and interest chargeable thereon) asserted against or incurred by Spectra that arise out of, result from, or may be payable by virtue of, any breach or non-performance of any representation, warranty, covenant or agreement made or obligation to be performed by you pursuant to these Terms.
    </li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>TERMS of USAGE:</span>
  </h2>
  <ul>
    <li>You accept that you have read the TOU and You are legally bound by this TOU.</li>
    <li>The moment you click “I agree” button this TOU shall be automatically effective and shall remain effective till the termination of the same.</li>
    <li>You are bound to the TOU till such time as you are using Spectra website or possess Spectra user account.</li>
  </ul>

  <h2>
    <span style={{ fontSize: "1.6em" }}>&#11044;</span>
    <span style={{ fontWeight: "bold", marginLeft: "12px" }}>NOTICES :</span>
  </h2>
  <ul>
    <li>All the communication will be in written or electronic format and it will be delivered to you within 5 business days. The Company shall not be responsible if the contact address is not provided correctly.</li>
    <li>Any support which you require from the company, You can reach our support team at <a href="mailto:support@spectra.co">support@spectra.co</a></li>
  </ul>

  </div>
);

const FooterBar = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  return (
    <footer className="footer-bar">
      <div className="footer-copyright">
        Copyrights © 2025 Shyam Spectra Pvt. Ltd.
      </div>
      <div className="footer-links">
        <span
          className="footer-link"
          onClick={() => setTermsOpen(true)}
        >
          Terms & Conditions
        </span>
        <span className="footer-link-divider"></span>
        <span
          className="footer-link"
          onClick={() => setPrivacyOpen(true)}
        >
          Privacy Policy
        </span>
      </div>
      <PolicyModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Terms & Conditions"
        bgImage={bgImage}
      >
        {TERMS_HTML}
      </PolicyModal>
      <PolicyModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Privacy Policy"
        bgImage={bgImage}
      >
        {PRIVACY_POLICY_HTML}
      </PolicyModal>
    </footer>
  );
};

export default FooterBar;