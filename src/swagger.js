// ---------- helpers ----------
const json = (properties, required = []) => ({
  required: true,
  content: { "application/json": { schema: { type: "object", required, properties } } },
});
const multipart = (properties, required = []) => ({
  required: true,
  content: { "multipart/form-data": { schema: { type: "object", required, properties } } },
});
const pathParam = (name, description = "MongoDB ObjectId") => ({
  name, in: "path", required: true, description, schema: { type: "string" },
});
const secured = [{ bearerAuth: [] }];
const ok = (description = "Success") => ({
  200: { description },
  400: { description: "Validation error / bad request" },
});
const authed = {
  ...{ 403: { description: "Missing/invalid token or not authorized for this role" } },
};
const str = { type: "string" };
const files = { type: "array", items: { type: "string", format: "binary" } };
const file = { type: "string", format: "binary" };

// ---------- spec ----------
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Social Platform API",
    version: "1.0.0",
    description:
      "Auth: login, copy `access_token`, press **Authorize** and paste it (without the word Bearer).",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "Auth" }, { name: "User" }, { name: "Post" },
    { name: "Comment" }, { name: "Admin" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  paths: {
    // ===================== AUTH =====================
    "/auth/verify": {
      post: {
        tags: ["Auth"], summary: "Send OTP to email (step 1 of register)",
        requestBody: json({ email: str }, ["email"]),
        responses: ok("OTP sent"),
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"], summary: "Register (needs OTP from /auth/verify)",
        requestBody: json(
          {
            email: str,
            userName: { type: "string", minLength: 5, maxLength: 15 },
            password: str,
            confirmPassword: str,
            phone: str,
            gender: { type: "string", enum: ["male", "female"] },
            otp: { type: "string", minLength: 6, maxLength: 6 },
          },
          ["email", "userName", "password", "confirmPassword", "phone", "otp"],
        ),
        responses: ok("User created"),
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"], summary: "Login",
        requestBody: json({ email: str, password: str }, ["email", "password"]),
        responses: ok("Returns access_token and refresh_token"),
      },
    },
    "/auth/forget-password": {
      post: {
        tags: ["Auth"], summary: "Send reset-password OTP",
        requestBody: json({ email: str }, ["email"]),
        responses: ok("OTP sent"),
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"], summary: "Reset password using OTP",
        requestBody: json(
          {
            email: str,
            otp: { type: "string", minLength: 6, maxLength: 6 },
            password: str,
            confirmPassword: str,
          },
          ["email", "otp", "password", "confirmPassword"],
        ),
        responses: ok("Password changed"),
      },
    },
    "/auth/new-access": {
      post: {
        tags: ["Auth"], summary: "Get a new access token from refresh token",
        requestBody: json({ refresh_token: str }, ["refresh_token"]),
        responses: ok("New access_token"),
      },
    },
    "/auth/loginWithGmail": {
      post: {
        tags: ["Auth"], summary: "Login with Google idToken",
        requestBody: json({ idToken: str }, ["idToken"]),
        responses: ok("Returns tokens"),
      },
    },

    // ===================== USER =====================
    "/user/profile": {
      get: {
        tags: ["User"], summary: "Get my profile", security: secured,
        responses: { ...ok(), ...authed },
      },
    },
    "/user/update-profile": {
      put: {
        tags: ["User"], summary: "Update profile", security: secured,
        requestBody: json({
          userName: { type: "string", minLength: 5, maxLength: 20 },
          gender: { type: "string", enum: ["male", "female"] },
          phone: str,
        }),
        responses: { ...ok(), ...authed },
      },
    },
    "/user/changepassword": {
      put: {
        tags: ["User"], summary: "Change password", security: secured,
        requestBody: json(
          { oldPassword: str, password: str, confirmPassword: str },
          ["oldPassword", "password", "confirmPassword"],
        ),
        responses: { ...ok(), ...authed },
      },
    },
    "/user": {
      delete: {
        tags: ["User"], summary: "Delete (soft) my account", security: secured,
        responses: { ...ok(), ...authed },
      },
    },
    "/user/update-email": {
      put: {
        tags: ["User"], summary: "Request email change (sends verification link)",
        security: secured,
        requestBody: json({ email: str, password: str }, ["email", "password"]),
        responses: { ...ok(), ...authed },
      },
    },
    "/user/verify-email/{token}": {
      get: {
        tags: ["User"], summary: "Confirm new email (link from email)",
        parameters: [pathParam("token", "Token from the email link")],
        responses: ok("Email changed"),
      },
    },
    "/user/profile-picture": {
      post: {
        tags: ["User"], summary: "Upload profile picture", security: secured,
        requestBody: multipart({ image: file }, ["image"]),
        responses: { ...ok(), ...authed },
      },
      delete: {
        tags: ["User"], summary: "Delete profile picture", security: secured,
        responses: { ...ok(), ...authed },
      },
    },
    "/user/cover-picture": {
      post: {
        tags: ["User"], summary: "Upload cover pictures", security: secured,
        requestBody: multipart({ images: files }, ["images"]),
        responses: { ...ok(), ...authed },
      },
    },
    "/user/share-profile": {
      get: {
        tags: ["User"], summary: "Share profile", security: secured,
        responses: { ...ok(), ...authed },
      },
    },

    // ===================== POST =====================
    "/post": {
      post: {
        tags: ["Post"], summary: "Create post (text and/or images)", security: secured,
        requestBody: multipart({ text: { type: "string", minLength: 3 }, images: files }),
        responses: { ...ok("Post created"), ...authed },
      },
    },
    "/post/{id}": {
      get: {
        tags: ["Post"], summary: "Get post by id", security: secured,
        parameters: [pathParam("id")],
        responses: { ...ok(), ...authed },
      },
      patch: {
        tags: ["Post"], summary: "Update post", security: secured,
        parameters: [pathParam("id")],
        requestBody: multipart({ text: { type: "string", minLength: 3 }, images: files }),
        responses: { ...ok(), ...authed },
      },
    },
    "/post/{id}/delete": {
      patch: {
        tags: ["Post"], summary: "Freeze (soft delete) post", security: secured,
        parameters: [pathParam("id")],
        responses: { ...ok(), ...authed },
      },
    },
    "/post/{id}/unfreeze": {
      patch: {
        tags: ["Post"], summary: "Unfreeze post", security: secured,
        parameters: [pathParam("id")],
        responses: { ...ok(), ...authed },
      },
    },
    "/post/all/active": {
      get: {
        tags: ["Post"], summary: "Get all active posts", security: secured,
        responses: { ...ok(), ...authed },
      },
    },
    "/post/all/freezed": {
      get: {
        tags: ["Post"], summary: "Get all freezed posts", security: secured,
        responses: { ...ok(), ...authed },
      },
    },
    "/post/{id}/like-unlike": {
      patch: {
        tags: ["Post"], summary: "Like / unlike post", security: secured,
        parameters: [pathParam("id")],
        responses: { ...ok(), ...authed },
      },
    },

    // ===================== COMMENT (nested under post) =====================
    "/post/{postId}/comment": {
      post: {
        tags: ["Comment"], summary: "Create comment on a post", security: secured,
        parameters: [pathParam("postId", "Post id")],
        requestBody: multipart({ text: str, images: file }),
        responses: { ...ok("Comment created"), ...authed },
      },
    },
    "/post/{postId}/comment/{id}": {
      patch: {
        tags: ["Comment"], summary: "Update comment", security: secured,
        parameters: [pathParam("postId", "Post id"), pathParam("id", "Comment id")],
        requestBody: multipart({ text: str, images: file }),
        responses: { ...ok(), ...authed },
      },
      post: {
        tags: ["Comment"], summary: "Reply to a comment", security: secured,
        parameters: [pathParam("postId", "Post id"), pathParam("id", "Comment id")],
        requestBody: multipart({ text: str, images: file }),
        responses: { ...ok("Reply added"), ...authed },
      },
      delete: {
        tags: ["Comment"], summary: "Hard delete comment", security: secured,
        parameters: [pathParam("postId", "Post id"), pathParam("id", "Comment id")],
        responses: { ...ok(), ...authed },
      },
      get: {
        tags: ["Comment"],
        summary: "Get comments of a post",
        description:
          "In the code this route is `/:postId` under `/post/:postId/comment`, so the post id appears twice in the URL. Enter the same post id in both fields.",
        security: secured,
        parameters: [
          pathParam("postId", "Post id"),
          pathParam("id", "Post id again (same value)"),
        ],
        responses: { ...ok(), ...authed },
      },
    },
    "/post/{postId}/comment/{id}/delete": {
      patch: {
        tags: ["Comment"], summary: "Freeze (soft delete) comment", security: secured,
        parameters: [pathParam("postId", "Post id"), pathParam("id", "Comment id")],
        responses: { ...ok(), ...authed },
      },
    },
    "/post/{postId}/comment/{id}/like-comment": {
      patch: {
        tags: ["Comment"], summary: "Like / unlike comment", security: secured,
        parameters: [pathParam("postId", "Post id"), pathParam("id", "Comment id")],
        responses: { ...ok(), ...authed },
      },
    },

    // ===================== ADMIN =====================
    "/admin": {
      get: {
        tags: ["Admin"], summary: "Get all (admin / superadmin)",
        security: secured,
        responses: { ...ok(), ...authed },
      },
    },
    "/admin/role": {
      patch: {
        tags: ["Admin"], summary: "Change a user's role (admin / superadmin)",
        security: secured,
        requestBody: json(
          { userId: str, role: { type: "string", enum: ["superadmin", "admin", "user"] } },
          ["userId", "role"],
        ),
        responses: { ...ok(), ...authed },
      },
    },
  },
};
export default swaggerSpec;
