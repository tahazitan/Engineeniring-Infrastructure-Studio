import {services,experience,education} from './marketing-data';
export type Locale='en'|'fr'|'ar';
export const locales:Locale[]=['en','fr','ar'];
export const isLocale=(value:string):value is Locale=>locales.includes(value as Locale);
export const localeName:Record<Locale,string>={en:'English',fr:'Français',ar:'العربية'};
export const serviceBase=services;
const serviceTranslated={
 fr:[
 ['Assistance informatique à distance','Diagnostic et dépannage des postes, logiciels, périphériques et accès réseau.','Support utilisateur à distance, analyse des incidents Windows/Linux et accompagnement à la résolution dans un périmètre autorisé.',['Diagnostic et évaluation de l’impact','Dépannage et actions correctives','Compte rendu clair des interventions']],
 ['Réseaux, configuration et VPN','Connectivité fiable entre bureaux, utilisateurs et services.','Configuration TCP/IP, VLAN, routage, politiques de pare-feu, VPN IPsec et documentation réseau.',['Plan d’adressage et de segmentation','Revue de configuration réseau/VPN','Tests de connectivité et compte rendu']],
 ['Windows Server et Active Directory','Gestion structurée des comptes, du DNS et du partage de fichiers.','Assistance pour Windows Server, AD DS, DNS, DHCP, GPO et permissions SMB.',['Revue AD/DNS','Plan de comptes, groupes et partages','Vérifications et documentation']],
 ['Serveurs Linux, VPS et Docker','Installation et maintenance des services Linux.','Maintenance Ubuntu/Debian, SSH, services systemd, diagnostics VPS et environnements Docker.',['Notes de configuration','Contrôles de sécurité et disponibilité','Recommandations de maintenance']],
 ['Supervision, journaux et diagnostic','Visibilité sur les équipements et services.','Supervision Zabbix/SNMP, journalisation, alertes et analyses réseau avec Wireshark.',['Plan de supervision','Indicateurs et contrôles de santé','Notes d’investigation']],
 ['Revue de sécurité de l’infrastructure','Amélioration des accès, règles et de la segmentation.','Revue autorisée des configurations, politiques de pare-feu, VPN et durcissement SSH.',['Constats dans le périmètre convenu','Plan de remédiation priorisé','Recommandations de configuration']]
 ],
 ar:[
 ['الدعم التقني عن بُعد','تشخيص أعطال الحواسيب والبرامج والأجهزة والاتصال بالشبكة.','مساعدة تقنية عن بُعد لنظامي Windows وLinux، مع تشخيص الأعطال وإصلاحها في حدود الصلاحيات الممنوحة.',['تشخيص المشكلة وتحديد أثرها','إجراءات الإصلاح والدعم','تقرير واضح بالنتائج']],
 ['إعداد الشبكات والاتصال الآمن VPN','ربط موثوق بين المكاتب والمستخدمين والخدمات.','إعداد TCP/IP وVLAN والتوجيه وسياسات الجدار الناري وشبكات VPN من نوع IPsec وتوثيق البنية.',['مخطط عناوين الشبكة وعزلها','مراجعة إعدادات الشبكة وVPN','اختبارات الاتصال والتوثيق']],
 ['Windows Server وActive Directory','تنظيم المستخدمين وDNS والوصول إلى الملفات.','المساعدة في إعداد Windows Server وActive Directory وخدمات DNS وDHCP وGPO وأذونات المشاركة.',['مراجعة Active Directory وDNS','خطة الحسابات والمجموعات والصلاحيات','التحقق والتوثيق']],
 ['خوادم Linux وVPS وDocker','إعداد خدمات Linux وصيانتها.','صيانة Ubuntu وDebian وإعداد SSH وخدمات النظام وتشخيص VPS وبيئات Docker.',['ملاحظات الإعداد','فحوص الأمان والتوافر','توصيات الصيانة والاستعادة']],
 ['المراقبة والسجلات والتشخيص','تحسين الرؤية حول حالة الخدمات والبنية التحتية.','مراقبة Zabbix وSNMP وتجميع السجلات والتخطيط للتنبيهات وتحليل الشبكة باستعمال Wireshark.',['خطة المراقبة والتنبيهات','المؤشرات وفحوص الصحة','تقرير التحليل']],
 ['مراجعة أمن البنية التحتية','تحسين سياسات الوصول والعزل والحماية.','مراجعة الإعدادات المصرّح بها وقواعد الجدار الناري وVPN وتعزيز أمان SSH.',['الملاحظات ضمن النطاق المتفق عليه','أولويات المعالجة','توصيات إعدادات الأمان']]
 ]
} as const;
export function getServices(lang:Locale){
 return services.map((service,i)=>{
  if(lang==='en')return service;
  const r=serviceTranslated[lang][i];
  return {...service,title:r[0],short:r[1],details:r[2],deliverables:[...r[3]]};
 });
}
const experienceCopy={
 fr:[
 ['Support informatique et infrastructure indépendant','Activité freelance à distance','Dépannage distant, configuration de systèmes et réseaux, administration de VPS et documentation selon les missions. Les laboratoires personnels sont présentés à part.'],
 ['Mission réseaux et support utilisateurs','Environnement logiciel de santé — Enova Santé','Assistance technique réseau et support des utilisateurs d’une application de santé.'],
 ['Accompagnement de travaux pratiques','ETIGA','Encadrement d’exercices pratiques en réseaux et administration systèmes.'],
 ['Stage technicien informatique','Direction provinciale de l’Éducation · Chefchaouen','Travaux LAN Cisco, serveurs physiques, Windows Server, Active Directory, maintenance des postes et périphériques.']
 ],
 ar:[
 ['دعم تقني مستقل وإدارة البنية التحتية','عمل حر عن بُعد','تشخيص أعطال عن بُعد، وإعداد الأنظمة والشبكات، وإدارة VPS وتوثيق الأعمال حسب كل مهمة. المشاريع التدريبية الشخصية معروضة بصورة منفصلة.'],
 ['مهمة في الشبكات ودعم المستخدمين','بيئة برمجية صحية — Enova Santé','مساندة تقنية للشبكة ودعم مستخدمي تطبيق في المجال الصحي.'],
 ['تأطير الأعمال التطبيقية','ETIGA','تأطير المتدربين في التمارين العملية للشبكات والأنظمة.'],
 ['تدريب تقني في الإعلاميات','المديرية الإقليمية للتعليم · شفشاون','أعمال شبكة Cisco LAN، خوادم فعلية، Windows Server، Active Directory وصيانة الحواسيب والملحقات.']
 ]
} as const;
export const getExperience=(lang:Locale)=>experience.map((x,i)=>lang==='en'?x:{...x,role:experienceCopy[lang][i][0],company:experienceCopy[lang][i][1],summary:experienceCopy[lang][i][2]});
const educationCopy={
 fr:[
 ['Diplôme de Technicien Spécialisé — Réseaux informatiques','OFPPT · ISMO Tétouan','Diplôme obtenu ; formation technique en réseaux et systèmes.'],
 ['Première année d’études d’ingénierie','EMSI Tanger','Première année suivie ; cursus non terminé, aucun diplôme d’ingénieur revendiqué.'],
 ['Sciences physiques','Faculté des Sciences · Université Abdelmalek Essaâdi','Une année universitaire suivie.'],
 ['Baccalauréat','Système national d’éducation marocain','Diplôme secondaire.']
 ],
 ar:[
 ['دبلوم تقني متخصص في الشبكات المعلوماتية','OFPPT · ISMO تطوان','دبلوم مكتمل في تقنيات الشبكات والأنظمة.'],
 ['السنة الأولى من التكوين الهندسي','EMSI طنجة','دراسة السنة الأولى دون إتمام المسار؛ لا يُقدَّم على أنه دبلوم مهندس.'],
 ['العلوم الفيزيائية','كلية العلوم · جامعة عبد المالك السعدي','سنة جامعية واحدة.'],
 ['شهادة البكالوريا','المنظومة الوطنية للتربية والتعليم','شهادة التعليم الثانوي.']
 ]
} as const;
export const getEducation=(lang:Locale)=>education.map((x,i)=>lang==='en'?x:{...x,title:educationCopy[lang][i][0],school:educationCopy[lang][i][1],note:educationCopy[lang][i][2]});
const dictionary={
 en:{
 nav:['Home','Services','Projects','Experience','Contact','Engineering Studio'],
 mast:'REMOTE IT SERVICES / NETWORK & SYSTEMS ENGINEERING',topline:'NETWORKS / SYSTEMS / TECHNICAL SUPPORT',
 heroTitle:'IT SOLUTIONS',heroAccent:'FOR BUSINESS.',heroLead:'Reliable systems. Connected teams. Practical support.',
 heroBody:'Independent remote IT support, network configuration, Windows/Linux systems and infrastructure diagnostics for businesses and professionals.',
 heroCta:'Discuss your IT needs',servicesCta:'Explore services',trust:['Remote-first','Agreed scope','French · English · Arabic'],technology:'TECHNOLOGIES IN PRACTICE',
 servicesEyebrow:'01 / TECHNICAL SERVICES',servicesTitle:'CLIENT SERVICES',servicesAccent:'AND SOLUTIONS',servicesDesc:'Practical IT assistance with a defined scope, documented actions and clear handover.',serviceDetail:'Service details',servicesQuestion:'Need help with a specific system?',servicesAsk:'Describe the issue',
 processEyebrow:'02 / HOW WE WORK',processTitle:'FROM INCIDENT',processAccent:'TO RESOLUTION',processDesc:'A straightforward process for freelance assignments and long-term client relationships.',
 steps:[['Scope','Define the issue, access permissions and expected result.'],['Plan','Review requirements, constraints and recovery options.'],['Deliver','Troubleshoot or configure only what is authorized.'],['Verify','Test results and document the handover.']],
 studioEyebrow:'03 / INTERNAL ENGINEERING TOOL',studioTitle:'INFRASTRUCTURE',studioAccent:'STUDIO',studioDesc:'A working environment for projects, configs, training and test evidence — separate from public service marketing.',studioBody:'Build and import GNS3 networks, maintain configuration notes, track checklist progress and record verification results. Access is limited to the local private workspace.',studioLink:'Studio workspace',projectLink:'Technical areas',studioFeatures:['Native GNS3 device and link operations','Editable network nodes and config notes','Lab verification and evidence','Training checklist and work progression'],
 aboutEyebrow:'04 / TECHNICAL PRACTICE',aboutTitle:'ENGINEER-LED',aboutAccent:'SERVICE',aboutDesc:'Networking and systems expertise grounded in practical support.',aboutBody:'I am Taha Zitane, a specialized network technician based in Chefchaouen, Morocco. I work across remote support, Windows/Linux administration, network diagnostics and infrastructure security.',aboutLink:'Experience and education',
 finalEyebrow:'HAVE A TECHNICAL REQUEST?',finalTitle:'LET’S DISCUSS THE WORK.',finalBody:'One-off troubleshooting, project configurations and ongoing remote assistance.',finalButton:'Contact for a quote',
 pageService:'IT SERVICES',pageServiceLead:'Technical support and infrastructure engineering scoped to your environment.',deliverables:'Typical deliverables',discuss:'Discuss this service',scope:'Services are agreed individually. Remote access, credentials and security changes require explicit authorization.',
 pageAbout:'THE ENGINEER',pageAboutLead:'Technical support, network systems and practical engineering experience.',bioTitle:'Systems, networks and operations.',bioBody:'Independent systems and networking technician providing remote IT assistance and documenting engineering projects. Personal labs are identified separately from professional experience.',
 experience:'WORK EXPERIENCE',experienceLead:'Reported professional roles and technical assignments.',studies:'EDUCATION',studiesLead:'Completed qualifications and academic attendance are distinguished clearly.',workCta:'Request technical assistance',
 pageProjects:'TECHNICAL FOCUS',pageProjectsLead:'Infrastructure topics developed in the private Studio. Detailed experimental diagrams stay in the working environment, not in public sales material.',technicalFocus:'Areas of practice',projectNotice:'Design work is carried out in the private Studio. Reference projects are not presented as completed client implementations.',openStudio:'Open private Studio',
 pageContact:'CONTACT / PROJECT BRIEF',pageContactLead:'Explain your IT problem and send a clear brief through your preferred freelance or professional channel.',
 contactTitle:'Describe your request.',contactBody:'Prepare a brief without submitting private information to this website. Copy it and send it through Fiverr or LinkedIn.',contactChannels:'Professional channels',clientLocation:'Based in Chefchaouen, Morocco. Remote service for local and international clients.',
 serviceCategory:'Service category',environment:'Systems involved (optional)',description:'What needs to be done?',timing:'Preferred timing',timingOptions:['Flexible','Within a few days','Urgent — discuss availability','Recurring monthly assistance'],copyBrief:'Copy service brief',copied:'Brief copied',formNote:'The brief stays in your browser until you copy it. No message is stored or sent from this form. Never include passwords or access tokens.',goFiverr:'Continue on Fiverr',goLinkedIn:'Continue on LinkedIn',
 footerAbout:'Independent network, systems and IT support services, with remote-first delivery.',footerLinks:'Explore',footerContact:'Contact',footerTop:'Back to top',statusNotice:'Private engineering environment — operational data is not public.'
 },
 fr:{
 nav:['Accueil','Services','Domaines','Parcours','Contact','Studio technique'],
 mast:'SERVICES IT À DISTANCE / INGÉNIERIE RÉSEAUX & SYSTÈMES',topline:'RÉSEAUX / SYSTÈMES / SUPPORT INFORMATIQUE',
 heroTitle:'SOLUTIONS IT',heroAccent:'POUR ENTREPRISES.',heroLead:'Des systèmes fiables. Des équipes connectées. Un support concret.',
 heroBody:'Support informatique à distance, réseaux, systèmes Windows/Linux et diagnostics d’infrastructure pour entreprises et professionnels.',
 heroCta:'Parlons de votre besoin',servicesCta:'Découvrir les services',trust:['À distance','Périmètre convenu','Français · Anglais · Arabe'],technology:'TECHNOLOGIES UTILISÉES',
 servicesEyebrow:'01 / SERVICES TECHNIQUES',servicesTitle:'SERVICES IT',servicesAccent:'ET SOLUTIONS',servicesDesc:'Une assistance informatique avec un périmètre clair, des actions documentées et un compte rendu utile.',serviceDetail:'Voir le service',servicesQuestion:'Un problème informatique précis ?',servicesAsk:'Décrivez votre besoin',
 processEyebrow:'02 / MÉTHODE DE TRAVAIL',processTitle:'DU DIAGNOSTIC',processAccent:'À LA SOLUTION',processDesc:'Une démarche structurée pour les missions ponctuelles et la collaboration à distance.',
 steps:[['Cadrer','Préciser le problème, les autorisations et le résultat attendu.'],['Préparer','Étudier les exigences, les risques et les options de restauration.'],['Intervenir','Dépanner ou configurer dans le périmètre autorisé.'],['Vérifier','Contrôler les résultats et documenter la livraison.']],
 studioEyebrow:'03 / OUTIL INTERNE D’INGÉNIERIE',studioTitle:'STUDIO',studioAccent:'INFRASTRUCTURE',studioDesc:'Espace de travail technique pour projets, configurations, formation et preuves de test, distinct du site commercial.',studioBody:'Construire des topologies GNS3, conserver les configurations, suivre les tâches et documenter les tests. Accès limité à l’environnement local privé.',studioLink:'Ouvrir le Studio',projectLink:'Domaines techniques',studioFeatures:['Appareils et liens natifs dans GNS3','Topologies et configurations modifiables','Tests de laboratoire et preuves','Progression et exercices pratiques'],
 aboutEyebrow:'04 / EXPERTISE TECHNIQUE',aboutTitle:'UN SERVICE',aboutAccent:'D’EXPERT',aboutDesc:'L’expérience des réseaux et systèmes, au service des besoins concrets.',aboutBody:'Je suis Taha Zitane, technicien spécialisé en réseaux à Chefchaouen. J’interviens en support à distance, administration Windows/Linux, diagnostics réseau et sécurité des infrastructures.',aboutLink:'Parcours et formations',
 finalEyebrow:'UN BESOIN INFORMATIQUE ?',finalTitle:'PARLONS DE VOTRE PROJET.',finalBody:'Dépannage ponctuel, configuration ou assistance technique régulière.',finalButton:'Demander un échange',
 pageService:'SERVICES INFORMATIQUES',pageServiceLead:'Support à distance et ingénierie adaptés à votre environnement.',deliverables:'Livrables habituels',discuss:'Discuter de ce service',scope:'Chaque prestation est cadrée individuellement. L’accès distant et les modifications de sécurité exigent votre autorisation.',
 pageAbout:'PARCOURS TECHNIQUE',pageAboutLead:'Support, réseaux, systèmes et expérience pratique.',bioTitle:'Systèmes, réseaux et exploitation.',bioBody:'Technicien indépendant en réseaux et systèmes, je propose une assistance IT à distance et je documente mes projets techniques. Les laboratoires personnels sont distingués des expériences professionnelles.',
 experience:'EXPÉRIENCE PROFESSIONNELLE',experienceLead:'Missions et expériences techniques déclarées.',studies:'ÉTUDES ET FORMATION',studiesLead:'Les diplômes obtenus et les années d’études suivies sont présentés distinctement.',workCta:'Demander une assistance',
 pageProjects:'DOMAINES TECHNIQUES',pageProjectsLead:'Sujets d’infrastructure étudiés dans le Studio privé. Les schémas expérimentaux ne sont pas des supports commerciaux publics.',technicalFocus:'Domaines de pratique',projectNotice:'Le travail de conception a lieu dans le Studio privé. Les projets de référence ne sont pas présentés comme des réalisations client.',openStudio:'Ouvrir le Studio privé',
 pageContact:'CONTACT / DESCRIPTION DU BESOIN',pageContactLead:'Présentez votre besoin et transmettez un brief clair via votre canal professionnel préféré.',
 contactTitle:'Décrivez votre besoin.',contactBody:'Préparez un brief sans envoyer de données privées au site. Copiez-le pour l’envoyer sur Fiverr ou LinkedIn.',contactChannels:'Canaux professionnels',clientLocation:'Basé à Chefchaouen (Maroc). Missions à distance au Maroc et à l’international.',
 serviceCategory:'Type de service',environment:'Environnement concerné (facultatif)',description:'Quelle intervention souhaitez-vous ?',timing:'Délai souhaité',timingOptions:['Flexible','Sous quelques jours','Urgent — disponibilité à confirmer','Assistance mensuelle'],copyBrief:'Copier le brief',copied:'Brief copié',formNote:'Le brief reste dans votre navigateur ; il n’est ni enregistré ni envoyé. Ne partagez aucun mot de passe ou jeton d’accès.',goFiverr:'Continuer sur Fiverr',goLinkedIn:'Continuer sur LinkedIn',
 footerAbout:'Services indépendants de support informatique, réseaux et systèmes, à distance.',footerLinks:'Explorer',footerContact:'Contact',footerTop:'Retour en haut',statusNotice:'Espace d’ingénierie privé — les données d’exploitation ne sont pas publiques.'
 },
 ar:{
 nav:['الرئيسية','الخدمات','المجالات','الخبرة','التواصل','الاستوديو التقني'],
 mast:'خدمات تقنية عن بُعد / هندسة الشبكات والأنظمة',topline:'الشبكات / الأنظمة / الدعم التقني',
 heroTitle:'حلول تقنية',heroAccent:'للأعمال.',heroLead:'أنظمة موثوقة، فرق متصلة، ودعم تقني عملي.',
 heroBody:'دعم تقني مستقل عن بُعد للشركات والمهنيين، يشمل إعداد الشبكات وإدارة أنظمة Windows وLinux وتشخيص أعطال البنية التحتية.',
 heroCta:'ناقش احتياجاتك التقنية',servicesCta:'استكشف الخدمات',trust:['العمل عن بُعد','نطاق عمل متفق عليه','العربية · الفرنسية · الإنجليزية'],technology:'التقنيات المستخدمة',
 servicesEyebrow:'01 / الخدمات التقنية',servicesTitle:'خدمات تقنية',servicesAccent:'وحلول عملية',servicesDesc:'خدمات محددة النطاق مع توثيق الإجراءات وتسليم نتائج واضحة.',serviceDetail:'تفاصيل الخدمة',servicesQuestion:'عندك مشكل تقني محدد؟',servicesAsk:'أرسل تفاصيله',
 processEyebrow:'02 / منهجية العمل',processTitle:'من التشخيص',processAccent:'إلى الحل',processDesc:'طريقة عمل واضحة للمهام الفردية والتعاون التقني عن بُعد.',
 steps:[['تحديد النطاق','فهم المشكلة والصلاحيات والنتائج المطلوبة.'],['التخطيط','مراجعة المتطلبات والمخاطر وخيارات الاستعادة.'],['التنفيذ','التشخيص أو الإعداد ضمن الصلاحيات المتفق عليها.'],['التحقق','اختبار النتيجة وتوثيق العمل المنجز.']],
 studioEyebrow:'03 / بيئة هندسية خاصة',studioTitle:'استوديو',studioAccent:'البنية التحتية',studioDesc:'بيئة مستقلة للعمل على المشاريع والإعدادات والتدريب والأدلة التقنية، بعيداً عن الموقع التجاري.',studioBody:'تصميم الشبكات في GNS3، حفظ الإعدادات، متابعة المهام وتوثيق نتائج الاختبارات. الوصول إلى الاستوديو محلي وخاص.',studioLink:'فتح الاستوديو',projectLink:'المجالات التقنية',studioFeatures:['إنشاء الأجهزة والروابط داخل GNS3','تعديل المخططات وملفات الإعداد','اختبارات المختبر وحفظ الأدلة','تتبّع التقدم والتمارين العملية'],
 aboutEyebrow:'04 / الخبرة التقنية',aboutTitle:'خدمة تقنية',aboutAccent:'بإشراف متخصص',aboutDesc:'خبرة في الشبكات والأنظمة موجّهة لحل المشكلات الواقعية.',aboutBody:'أنا طه زيطان، تقني متخصص في الشبكات من شفشاون. أشتغل في الدعم عن بُعد وإدارة Windows وLinux وتشخيص الشبكات وأمن البنية التحتية.',aboutLink:'الخبرة والدراسة',
 finalEyebrow:'هل تحتاج إلى مساعدة تقنية؟',finalTitle:'لنتحدث عن مشروعك.',finalBody:'إصلاح الأعطال، إعدادات تقنية لمشاريع محددة أو دعم مستمر عن بُعد.',finalButton:'تواصل لطلب خدمة',
 pageService:'الخدمات التقنية',pageServiceLead:'دعم فني وهندسة بنية تحتية بحسب بيئتك ومتطلباتك.',deliverables:'المخرجات المعتادة',discuss:'ناقش هذه الخدمة',scope:'يُحدّد نطاق كل خدمة بالاتفاق. الوصول عن بُعد والتغييرات الأمنية تتطلب إذنك الصريح.',
 pageAbout:'المسار التقني',pageAboutLead:'الدعم التقني والشبكات والأنظمة والخبرة العملية.',bioTitle:'الشبكات والأنظمة والتشغيل.',bioBody:'أنا تقني متخصص في الشبكات والأنظمة، أقدم خدمات دعم عن بُعد وأوثق مشاريعي الهندسية. أميز بين المختبرات الشخصية والخبرة المهنية.',
 experience:'الخبرة المهنية',experienceLead:'المهام والخبرات التقنية الفعلية المصرّح بها.',studies:'الدراسة والتكوين',studiesLead:'تمييز واضح بين الشهادات المحصل عليها والسنوات الدراسية التي لم تُستكمل.',workCta:'اطلب مساعدة تقنية',
 pageProjects:'المجالات التقنية',pageProjectsLead:'مجالات البنية التحتية التي أعمل عليها داخل الاستوديو الخاص. المخططات التجريبية ليست أعمال عملاء منجزة.',technicalFocus:'مجالات العمل',projectNotice:'تُنجز التصاميم الهندسية في الاستوديو الخاص ولا تُعرض المشاريع المرجعية كعقود عملاء منجزة.',openStudio:'فتح الاستوديو الخاص',
 pageContact:'التواصل / وصف المشروع',pageContactLead:'اشرح طلبك التقني وجهّز وصفاً واضحاً لإرساله عبر قناتك المهنية المناسبة.',
 contactTitle:'اشرح احتياجك التقني.',contactBody:'حضّر وصف الطلب داخل متصفحك دون إرسال معلومات خاصة إلى هذا الموقع، ثم انسخه إلى Fiverr أو LinkedIn.',contactChannels:'قنوات التواصل',clientLocation:'أقيم في شفشاون، المغرب. أقدّم خدمات عن بُعد للعملاء محلياً ودولياً.',
 serviceCategory:'نوع الخدمة',environment:'البيئة التقنية (اختياري)',description:'ما المشكلة أو المهمة المطلوبة؟',timing:'الإطار الزمني',timingOptions:['مرن','خلال بضعة أيام','مستعجل — حسب التوافر','دعم شهري متكرر'],copyBrief:'نسخ وصف الطلب',copied:'تم نسخ الطلب',formNote:'يبقى النص داخل متصفحك ولا يُرسَل أو يُخزّن. لا تكتب كلمات المرور أو رموز الوصول.',goFiverr:'المتابعة عبر Fiverr',goLinkedIn:'المتابعة عبر LinkedIn',
 footerAbout:'خدمات تقنية مستقلة في دعم الحواسيب والشبكات والأنظمة عن بُعد.',footerLinks:'استكشف',footerContact:'التواصل',footerTop:'العودة للأعلى',statusNotice:'الاستوديو الهندسي خاص — بيانات العمل ليست عامة.'
 }
} as const;
export type SiteCopy=(typeof dictionary)['en'];
export const copyFor=(lang:Locale):SiteCopy=>dictionary[lang] as unknown as SiteCopy;
export const routeFor=(lang:Locale,path:string)=>lang==='en'?path:'/'+lang+(path==='/'?'':path);
