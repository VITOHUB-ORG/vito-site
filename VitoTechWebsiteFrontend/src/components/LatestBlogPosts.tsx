// src/components/LatestBlogPosts.tsx
type BlogPost = {
  id: number;
  image: string;
  dateMonth: string;
  dateDay: string;
  title: string;
  text: string;
  alt: string;
};

const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    image: "images/blogi1.jpg",
    dateMonth: "10",
    dateDay: "26",
    title: "Serverless Architectures: Future of Web",
    text: "Explore how serverless computing is revolutionizing web development, offering scalability and reduced operational costs for modern applications.",
    alt: "Web Development",
  },
  {
    id: 2,
    image: "images/blogi2.jpg",
    dateMonth: "11",
    dateDay: "05",
    title: "Cross-Platform Apps: Efficiency and Reach",
    text: "Discover the advantages of cross-platform development with frameworks like Flutter and React Native, saving time and expanding your audience.",
    alt: "Mobile App Development",
  },
  {
    id: 3,
    image: "images/blogAi.jpg",
    dateMonth: "11",
    dateDay: "12",
    title: "Computer Vision AI: Creativity Unleashed",
    text: "Learn how YOLO and OpenCV is transforming and detecting the objects suitable  in security, drone technology ,disease detection and other various tech industries.",
    alt: "AI Solutions",
  },
  {
    id: 4,
    image: "images/blogi4 .jpg",
    dateMonth: "11",
    dateDay: "19",
    title: "3D and Motion Graphics: Visual Storytelling",
    text: "Explore the power of 3D modeling and motion graphics in creating engaging visual content for digital platforms and marketing.",
    alt: "Graphics Design",
  },
  {
    id: 5,
    image: "images/blogi5.jpg",
    dateMonth: "11",
    dateDay: "26",
    title: "Accessible UI/UX: Design for Everyone",
    text: "Understand the importance of accessible UI design and how to implement WCAG standards for inclusive user experiences.",
    alt: "UI Design",
  },
  {
    id: 6,
    image: "images/blogi3.jpg",
    dateMonth: "12",
    dateDay: "03",
    title: "User-Centric Design: Data-Driven Insights",
    text: "Learn how to leverage user research and data analytics to create user-centric designs that drive engagement and improve user satisfaction.",
    alt: "UI/UX Design",
  },
];

export default function LatestBlogPosts() {
  return (
    <section
      id="news"
      className="bg-white py-16"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Heading */}
        <h2 className="text-center text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
          Latest Blog Posts
        </h2>

        {/* Grid */}
        <div className="mt-12 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={post.image}
                  alt={post.alt}
                  className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Date 10/26 style */}
              <div className="mt-5 flex items-baseline text-3xl font-semibold tracking-[0.35em] text-[#6f7dfa]">
                <span>{post.dateMonth}</span>
                <span className="ml-1 text-lg font-normal tracking-normal text-gray-500">
                  /{post.dateDay}
                </span>
              </div>

              {/* Title */}
              <h4 className="mt-3 text-lg font-semibold leading-snug text-gray-900">
                {post.title}
              </h4>

              {/* Text */}
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {post.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
