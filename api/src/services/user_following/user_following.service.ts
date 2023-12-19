// Initializes the `user_following` service on path `/user-following`
import { authenticate } from "@feathersjs/express";
import { Paginated, ServiceAddons } from "@feathersjs/feathers";
import { validate } from "uuid";
import { Application } from "../../declarations";
import createModel from "../../models/user_following.model";
import { Users } from "../users/users.class";
import { UserFollowing } from "./user_following.class";
import hooks from "./user_following.hooks";

// Add this service to the service type index
declare module "../../declarations" {
	interface ServiceTypes {
		"user-following": UserFollowing & ServiceAddons<any>;
	}
}

export default function (app: Application): void {
	const options = {
		Model: createModel(app),
		paginate: app.get("paginate"),
	};

	// Initialize our service with any options it requires
	app.use("/user-following", new UserFollowing(options, app));

	app.post("/follow-user", authenticate("jwt"), async (req: any, res: any) => {
		const { user } = req;
		if (!req.body.user_id) {
			res.send(400, "user_id is required");
			return;
		}
		if (!validate(req.body.user_id)) {
			res.send(400, "user_id must be a valid id");
			return;
		}
		const row = (await app.service("user-following").find({
			query: { followed_id: req.body.user_id, user_id: user.id },
		})) as Paginated<any>;
		if (row.data[0]) {
			res.send(200, "This user is already followed");
			return;
		}

		const result = await app
			.service("user-following")
			.create({ followed_id: req.body.user_id } as Partial<any>, {
				user: user,
			});
		res.send(result);
	});

	app.post(
		"/unfollow-user",
		authenticate("jwt"),
		async (req: any, res: any) => {
			const { user } = req;
			if (!req.body.user_id) {
				res.send(400, "user_id is required");
				return;
			}
			if (!validate(req.body.user_id)) {
				res.send(400, "user_id must be a valid id");
				return;
			}
			const row = (await app.service("user-following").find({
				query: { followed_id: req.body.user_id, user_id: user.id },
			})) as Paginated<any>;
			if (!row.data[0]) {
				res.send(200, "This user is not followed");
				return;
			}
			await app.service("user-following").remove(row.data[0].id, {
				user: user,
			});
			res.send("Successfully Unfollowed");
		}
	);

	app.get(
		"/get-followed-users",
		(authenticate("jwt"),
			async (req: any, res: any) => {
				if (!req.query.user_id) {
					res.send(400, "You must provide a user_id");
					return;
				}
				if (!validate(req.query.user_id)) {
					res.send(400, "You must provide a valid uuid");
					return;
				}
				const { user } = req;
				const result = await app.service("user-following").find({
					query: {
						// $limit: 0,
						$select: ["id"],
						followed_id: req.query.user_id,
					},
					user: user,
					sequelize: {
						include: [
							{
								model: (app.service("users") as Users & ServiceAddons<any>).Model,
								as: "follower",
								attributes: ["id", "username"],
							},
						],
						raw: true,
						nest: true,
					},
				});
				try {
					let formattedRes = [] as any[];
					for (const item of (result as Paginated<any>).data) {
						formattedRes.push((item as any).follower);
					}
					(result as any).data = formattedRes;
				} catch (e) {
					console.log(e);
				}
				res.send(result);
			})
	);

	app.get(
		"/get-following-users",
		(authenticate("jwt"),
			async (req: any, res: any) => {
				if (!req.query.user_id) {
					res.send(400, "You must provide a user_id");
					return;
				}
				if (!validate(req.query.user_id)) {
					res.send(400, "You must provide a valid uuid");
					return;
				}
				const { user } = req;
				const result = await app.service("user-following").find({
					query: {
						// $limit: 0,
						$select: ["id"],
						user_id: req.query.user_id,
					},
					user: user,
					sequelize: {
						include: [
							{
								model: (app.service("users") as Users & ServiceAddons<any>).Model,
								as: "followed",
								attributes: ["id", "username"],
							},
						],
						raw: true,
						nest: true,
					},
				});

				try {
					let formattedRes = [] as any[];
					for (const item of (result as Paginated<any>).data) {
						formattedRes.push((item as any).followed);
					}
					(result as any).data = formattedRes;
				} catch (e) {
					console.log(e);
				}
				res.send(result);
			})
	);

	// Get our initialized service so that we can register hooks
	const service = app.service("user-following");

	service.hooks(hooks);
}
